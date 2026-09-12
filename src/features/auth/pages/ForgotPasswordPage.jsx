import { useState } from 'react'
import { Alert, Button, Link, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { AuthForm, FormError, SubmitButton } from '../components/AuthFormParts'
import { AuthLayout } from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../../../services/auth/authService'
export function ForgotPasswordPage() {
  const { resetPassword } = useAuth(); const [email, setEmail] = useState(''); const [error, setError] = useState(''); const [success, setSuccess] = useState(false); const [loading, setLoading] = useState(false)
  const submit = async (event) => { event.preventDefault(); setError(''); if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email address.'); return }; setLoading(true); try { await resetPassword(email); setSuccess(true) } catch (requestError) { setError(getAuthErrorMessage(requestError)) } finally { setLoading(false) } }
  return <AuthLayout eyebrow="RESET PASSWORD" title={success ? 'Check your inbox.' : 'Let’s get you back in.'} description={success ? `We sent a password-reset link to ${email}. It may take a minute to arrive.` : 'Enter your email and we’ll send a secure reset link.'}>{success ? <><Alert severity="success" sx={{ borderRadius: 3 }}>Reset link sent successfully.</Alert><Button component={RouterLink} to="/login" variant="contained">Back to log in</Button></> : <AuthForm onSubmit={submit}><FormError>{error}</FormError><TextField label="Email address" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} fullWidth required /><SubmitButton loading={loading}>Send reset link</SubmitButton><Typography align="center" variant="body2"><Link component={RouterLink} to="/login" sx={{ color: '#FEC29F', fontWeight: 800 }}>Back to log in</Link></Typography></AuthForm>}</AuthLayout>
}
