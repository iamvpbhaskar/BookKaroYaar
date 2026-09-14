import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

// Dashboard collections arrive with their respective modules. This targeted profile read
// lets the command center establish a reliable loading/error/empty state without inventing data.
export async function getDashboardSnapshot(uid) {
  const profileSnapshot = await getDoc(doc(db, 'users', uid))
  const membershipsSnapshot = await getDocs(query(collectionGroup(db, 'members'), where('uid', '==', uid)))
  const groupMemberships = membershipsSnapshot.docs.filter((membership) => membership.ref.path.split('/').length === 4)
  const planResults = await Promise.all(groupMemberships.map(async (membership) => {
    const groupId = membership.ref.parent.parent.id
    const plansSnapshot = await getDocs(collection(db, 'groups', groupId, 'plans'))
    return plansSnapshot.docs.map((plan) => ({ id: plan.id, groupId, ...plan.data() }))
  }))
  return { profile: profileSnapshot.exists() ? profileSnapshot.data() : null, groupCount: groupMemberships.length, plans: planResults.flat(), attention: [], activity: [], balances: [] }
}
