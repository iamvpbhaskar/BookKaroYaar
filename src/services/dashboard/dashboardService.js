import { collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

// Dashboard collections arrive with their respective modules. This targeted profile read
// lets the command center establish a reliable loading/error/empty state without inventing data.
export async function getDashboardSnapshot(uid) {
  const profileSnapshot = await getDoc(doc(db, 'users', uid))
  const membershipsSnapshot = await getDocs(query(collectionGroup(db, 'members'), where('uid', '==', uid)))
  return { profile: profileSnapshot.exists() ? profileSnapshot.data() : null, groupCount: membershipsSnapshot.size, plans: [], attention: [], activity: [], balances: [] }
}
