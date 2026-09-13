import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore'
import { db } from '../firebase/config'
import { GROUP_ROLES } from '../../features/groups/groupConstants'

export function subscribeToUserGroups(uid, onData, onError) {
  const membershipsQuery = query(collectionGroup(db, 'members'), where('uid', '==', uid))
  let groupUnsubscribes = []
  let memberCountUnsubscribes = []
  return onSnapshot(membershipsQuery, (snapshot) => {
    groupUnsubscribes.forEach((unsubscribe) => unsubscribe())
    memberCountUnsubscribes.forEach((unsubscribe) => unsubscribe())
    groupUnsubscribes = []
    memberCountUnsubscribes = []
    const memberships = snapshot.docs.map((member) => ({ id: member.id, groupId: member.ref.parent.parent.id, ...member.data() }))
    const groups = new Map()
    const memberCounts = new Map()
    const emit = () => onData(memberships.map((membership) => groups.get(membership.groupId)).filter(Boolean).map((group) => ({ ...group, memberCount: memberCounts.get(group.id) || 0, membership: memberships.find((item) => item.groupId === group.id) })))
    memberships.forEach((membership) => {
      groupUnsubscribes.push(onSnapshot(doc(db, 'groups', membership.groupId), (groupSnapshot) => {
        if (groupSnapshot.exists()) groups.set(membership.groupId, { id: groupSnapshot.id, ...groupSnapshot.data() })
        else groups.delete(membership.groupId)
        emit()
      }, onError))
      memberCountUnsubscribes.push(onSnapshot(collection(db, 'groups', membership.groupId, 'members'), (memberSnapshot) => {
        memberCounts.set(membership.groupId, memberSnapshot.size)
        emit()
      }, onError))
    })
    if (!memberships.length) onData([])
  }, onError)
}

export function subscribeToGroup(groupId, onData, onError) { return onSnapshot(doc(db, 'groups', groupId), (snapshot) => onData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null), onError) }
export function subscribeToMembers(groupId, onData, onError) {
  return onSnapshot(collection(db, 'groups', groupId, 'members'), (snapshot) => {
    const order = { owner: 0, admin: 1, member: 2 }
    onData(snapshot.docs.map((member) => ({ id: member.id, ...member.data() })).sort((a, b) => order[a.role] - order[b.role] || a.displayNameSnapshot.localeCompare(b.displayNameSnapshot)))
  }, onError)
}

export async function createGroup({ name, description, coverImageUrl }, user) {
  const groupRef = doc(collection(db, 'groups')); const memberRef = doc(db, 'groups', groupRef.id, 'members', user.uid); const batch = writeBatch(db)
  batch.set(groupRef, { name: name.trim(), description: description.trim(), coverImageUrl: coverImageUrl.trim(), createdBy: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), status: 'active' })
  batch.set(memberRef, { uid: user.uid, role: GROUP_ROLES.OWNER, joinedAt: serverTimestamp(), displayNameSnapshot: user.displayName || user.email || 'Group owner', photoURLSnapshot: user.photoURL || '' })
  await batch.commit(); return groupRef.id
}

export async function updateGroup(groupId, values) { return updateDoc(doc(db, 'groups', groupId), { name: values.name.trim(), description: values.description.trim(), coverImageUrl: values.coverImageUrl.trim(), updatedAt: serverTimestamp() }) }
export async function addMember(groupId, { uid, displayNameSnapshot, photoURLSnapshot = '', role = GROUP_ROLES.MEMBER }) { return setDoc(doc(db, 'groups', groupId, 'members', uid.trim()), { uid: uid.trim(), role, joinedAt: serverTimestamp(), displayNameSnapshot: displayNameSnapshot.trim(), photoURLSnapshot: photoURLSnapshot.trim() }) }
export async function updateMemberRole(groupId, uid, role) { return updateDoc(doc(db, 'groups', groupId, 'members', uid), { role }) }
export async function transferOwnership(groupId, currentOwnerUid, nextOwnerUid) { const batch = writeBatch(db); batch.update(doc(db, 'groups', groupId, 'members', currentOwnerUid), { role: GROUP_ROLES.ADMIN }); batch.update(doc(db, 'groups', groupId, 'members', nextOwnerUid), { role: GROUP_ROLES.OWNER }); return batch.commit() }
export async function removeMember(groupId, uid) { return deleteDoc(doc(db, 'groups', groupId, 'members', uid)) }
export async function deleteGroup(groupId) { const members = await getDocs(collection(db, 'groups', groupId, 'members')); const batch = writeBatch(db); members.forEach((member) => batch.delete(member.ref)); batch.delete(doc(db, 'groups', groupId)); return batch.commit() }
export async function getGroupMember(groupId, uid) { const snapshot = await getDoc(doc(db, 'groups', groupId, 'members', uid)); return snapshot.exists() ? snapshot.data() : null }
