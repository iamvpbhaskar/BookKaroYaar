import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { GROUP_ROLES } from '../../features/groups/groupConstants'

/**
 * Generate a cryptographically secure, non-guessable, URL-safe token.
 * Uses the Web Crypto API.
 */
export function generateSecureToken(length = 24) {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const randomValues = new Uint8Array(length)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues)
  } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues)
  } else {
    throw new Error('Web Crypto API is required for secure token generation.')
  }
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length]
  }
  return result
}

/**
 * Find the single active, non-expired invite link for a group (V1 policy: 1 active invite per group).
 */
export async function getActiveGroupInvite(groupId) {
  if (!groupId) return null
  const invitesQuery = query(
    collection(db, 'inviteLinks'),
    where('groupId', '==', groupId),
    where('status', '==', 'active'),
    limit(5)
  )
  const snapshot = await getDocs(invitesQuery)
  const now = new Date()

  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data()
    const expiresAt = data.expiresAt ? data.expiresAt.toDate() : null
    if (expiresAt && expiresAt > now) {
      return { id: docSnapshot.id, ...data }
    }
  }

  return null
}

/**
 * Create or reuse the active invite link for a group.
 */
export async function createOrGetGroupInvite(groupId, group, user, { expiresInDays = 7 } = {}) {
  // Check active invite policy first: reuse active non-expired invite if present
  const existing = await getActiveGroupInvite(groupId)
  if (existing) {
    return existing
  }

  const token = generateSecureToken(24)
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000))

  const inviteRef = doc(db, 'inviteLinks', token)
  const payload = {
    groupId,
    createdBy: user.uid,
    inviterNameSnapshot: (user.displayName || user.email || 'A group member').trim(),
    groupNameSnapshot: (group.name || 'Group').trim(),
    groupDescriptionSnapshot: (group.description || '').trim(),
    groupCoverSnapshot: (group.coverImageUrl || '').trim(),
    status: 'active',
    role: GROUP_ROLES.MEMBER,
    createdAt: serverTimestamp(),
    expiresAt,
    usesCount: 0,
    revokedAt: null
  }

  await setDoc(inviteRef, payload)
  return { id: token, ...payload }
}

/**
 * Revoke an active invite link.
 */
export async function revokeGroupInvite(inviteId) {
  if (!inviteId) return
  const inviteRef = doc(db, 'inviteLinks', inviteId)
  await updateDoc(inviteRef, {
    status: 'revoked',
    revokedAt: serverTimestamp()
  })
}

/**
 * Publicly read and evaluate invite link status.
 * Returns: { status: 'active' | 'expired' | 'revoked' | 'invalid', invite: object | null }
 */
export async function getInvitePreview(code) {
  if (!code || typeof code !== 'string') {
    return { status: 'invalid', invite: null }
  }

  try {
    const inviteRef = doc(db, 'inviteLinks', code.trim())
    const snapshot = await getDoc(inviteRef)

    if (!snapshot.exists()) {
      return { status: 'invalid', invite: null }
    }

    const data = snapshot.data()
    const now = new Date()
    const expiresAt = data.expiresAt ? data.expiresAt.toDate() : null

    if (data.status === 'revoked') {
      return { status: 'revoked', invite: { id: snapshot.id, ...data } }
    }

    if (expiresAt && expiresAt <= now) {
      return { status: 'expired', invite: { id: snapshot.id, ...data } }
    }

    if (data.status !== 'active') {
      return { status: 'invalid', invite: null }
    }

    // Only safe public fields exposed
    const safeInvite = {
      id: snapshot.id,
      groupId: data.groupId,
      groupNameSnapshot: data.groupNameSnapshot || 'Group',
      groupDescriptionSnapshot: data.groupDescriptionSnapshot || '',
      groupCoverSnapshot: data.groupCoverSnapshot || '',
      inviterNameSnapshot: data.inviterNameSnapshot || 'A friend',
      status: data.status,
      expiresAt: data.expiresAt,
      usesCount: data.usesCount || 0
    }

    return { status: 'active', invite: safeInvite }
  } catch (error) {
    console.error('Error fetching invite preview:', error)
    return { status: 'invalid', invite: null }
  }
}

/**
 * Check whether a user is already a member of the group.
 */
export async function checkGroupMembership(groupId, uid) {
  if (!groupId || !uid) return false
  const memberRef = doc(db, 'groups', groupId, 'members', uid)
  const snapshot = await getDoc(memberRef)
  return snapshot.exists()
}

/**
 * Atomically join a group using a valid invite link.
 * Idempotent: checks existing membership and prevents duplicate writes.
 */
export async function joinGroupWithInvite(invite, user) {
  if (!invite || !invite.id || !invite.groupId) {
    throw new Error('Invalid invitation.')
  }
  if (!user || !user.uid) {
    throw new Error('You must be signed in to join.')
  }

  const memberRef = doc(db, 'groups', invite.groupId, 'members', user.uid)
  const inviteRef = doc(db, 'inviteLinks', invite.id)

  return await runTransaction(db, async (transaction) => {
    // 1. Verify membership doesn't already exist
    const memberDoc = await transaction.get(memberRef)
    if (memberDoc.exists()) {
      return { alreadyMember: true, groupId: invite.groupId }
    }

    // 2. Verify invite state is still valid
    const currentInviteDoc = await transaction.get(inviteRef)
    if (!currentInviteDoc.exists()) {
      throw new Error('This invitation no longer exists.')
    }

    const inviteData = currentInviteDoc.data()
    if (inviteData.status !== 'active') {
      throw new Error('This invitation is no longer active.')
    }

    const now = new Date()
    const expiresAt = inviteData.expiresAt ? inviteData.expiresAt.toDate() : null
    if (expiresAt && expiresAt <= now) {
      throw new Error('This invitation has expired.')
    }

    // 3. Create membership document
    transaction.set(memberRef, {
      uid: user.uid,
      role: GROUP_ROLES.MEMBER,
      joinedAt: serverTimestamp(),
      displayNameSnapshot: (user.displayName || user.email || 'Member').trim(),
      photoURLSnapshot: (user.photoURL || '').trim(),
      inviteId: invite.id
    })

    // 4. Atomically increment usesCount on the invite
    transaction.update(inviteRef, {
      usesCount: increment(1)
    })

    return { alreadyMember: false, success: true, groupId: invite.groupId }
  })
}
