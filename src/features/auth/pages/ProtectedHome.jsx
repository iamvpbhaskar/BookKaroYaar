import { useState } from 'react'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../../../services/auth/authService'
import { BrandMark } from '../components/AuthLayout'
export function ProtectedHome() {
  const { user, logOut, profileSyncError, retryProfileSync } = useAuth(); const [loggingOut, setLoggingOut] = useState(false); const [error, setError] = useState('')
  const signOut = async () => { setError(''); setLoggingOut(true); try { await logOut() } catch (signOutError) { setError(getAuthErrorMessage(signOutError)); setLoggingOut(false) } }
  return <Box sx={{ minHeight: '100vh', p: { xs: 3, sm: 5, md: 7 }, background: 'radial-gradient(circle at 90% 15%,#4c454b 0,#1D2630 42%)' }}><Stack spacing={5} sx={{ maxWidth: 760, mx: 'auto' }}><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}><BrandMark /><Button onClick={signOut} disabled={loggingOut} color="inherit" startIcon={<LogoutRoundedIcon />}>{loggingOut ? 'Logging out…' : 'Log out'}</Button></Box><Box sx={{ p: { xs: 3, sm: 5 }, borderRadius: 5, background: '#26313D', border: '1px solid rgba(254,194,159,.2)' }}><Typography variant="overline" sx={{ color: '#FEC29F', fontWeight: 900, letterSpacing: '.13em' }}>AUTHENTICATION COMPLETE</Typography><Typography variant="h1" sx={{ fontSize: { xs: 44, sm: 64 }, mt: 1 }}>You’re in, {user?.displayName?.split(' ')[0] || 'friend'}.</Typography><Typography sx={{ mt: 2, color: 'text.secondary', maxWidth: 480 }}>Your account is secure and ready. The next module will turn this protected foundation into your collaborative workspace.</Typography></Box>{profileSyncError && <Alert severity="warning" action={<Button color="inherit" size="small" onClick={retryProfileSync}>Retry</Button>} sx={{ borderRadius: 3 }}>Your profile could not be synced yet. Your session is still active.</Alert>}{error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}</Stack></Box>
}
