import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../services/firebase/config'
import { ensureUserProfile } from '../../../services/auth/profileService'
import { logOut, sendPasswordReset, signInWithEmail, signInWithGoogle, signUpWithEmail } from '../../../services/auth/authService'

const AuthContext = createContext(null)
export function AuthProvider({ children, fallback = null }) {
  const [user, setUser] = useState(null); const [initializing, setInitializing] = useState(true); const [profileSyncError, setProfileSyncError] = useState(null)
  const syncProfile = useCallback(async (currentUser) => { if (!currentUser) return; try { await ensureUserProfile(currentUser); setProfileSyncError(null) } catch (error) { setProfileSyncError(error) } }, [])
  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { setUser(currentUser); await syncProfile(currentUser); setInitializing(false) }); return unsubscribe }, [syncProfile])
  const value = useMemo(() => ({ user, initializing, profileSyncError, retryProfileSync: () => syncProfile(auth.currentUser), signUp: signUpWithEmail, signIn: signInWithEmail, signInWithGoogle, resetPassword: sendPasswordReset, logOut }), [initializing, profileSyncError, syncProfile, user])
  if (initializing) return fallback
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// This hook is intentionally colocated with its provider so feature consumers share one auth contract.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider.'); return context }
