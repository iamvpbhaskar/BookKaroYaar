import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// Dashboard collections arrive with their respective modules. This targeted profile read
// lets the command center establish a reliable loading/error/empty state without inventing data.
export async function getDashboardSnapshot(uid) {
  const profileSnapshot = await getDoc(doc(db, 'users', uid))
  return { profile: profileSnapshot.exists() ? profileSnapshot.data() : null, plans: [], attention: [], activity: [], balances: [] }
}
