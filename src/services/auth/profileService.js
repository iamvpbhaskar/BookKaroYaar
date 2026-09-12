import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function ensureUserProfile(user) {
  if (!user?.uid) return null
  const profileRef = doc(db, 'users', user.uid)
  const existingProfile = await getDoc(profileRef)
  const profile = { displayName: user.displayName || '', email: user.email || '', photoURL: user.photoURL || '', updatedAt: serverTimestamp(), lastLoginAt: serverTimestamp() }
  if (!existingProfile.exists()) Object.assign(profile, { createdAt: serverTimestamp(), onboardingComplete: false })
  await setDoc(profileRef, profile, { merge: true })
  return profileRef
}
