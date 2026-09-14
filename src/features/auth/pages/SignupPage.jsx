import { useState } from 'react'
import { Link, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { AuthDivider, AuthForm, FormError, GoogleButton, SubmitButton } from '../components/AuthFormParts'
import { AuthLayout } from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../../../services/auth/authService'

export function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ displayName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const nextPath = location.state?.from?.pathname || location.state?.from || '/app'

  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const validate = () => {
    const next = {}
    if (values.displayName.trim().length < 2) next.displayName = 'Enter the name your friends know you by.'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email address.'
    if (values.password.length < 6) next.password = 'Use at least 6 characters.'
    if (values.confirmPassword !== values.password) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    return !Object.keys(next).length
  }

  const submit = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    try {
      await signUp(values)
      navigate(nextPath, { replace: true })
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    setFormError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate(nextPath, { replace: true })
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return <AuthLayout eyebrow="START SOMETHING GOOD" title="Plans hit different together." description="Create your space for the group chat’s next great idea."><AuthForm onSubmit={submit}><FormError>{formError}</FormError><GoogleButton loading={loading} onClick={google} /><AuthDivider /><TextField label="Your name" name="displayName" autoComplete="name" value={values.displayName} onChange={change} error={Boolean(errors.displayName)} helperText={errors.displayName} disabled={loading} fullWidth required /><TextField label="Email address" name="email" type="email" autoComplete="email" value={values.email} onChange={change} error={Boolean(errors.email)} helperText={errors.email} disabled={loading} fullWidth required /><TextField label="Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={change} error={Boolean(errors.password)} helperText={errors.password || 'At least 6 characters.'} disabled={loading} fullWidth required /><TextField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={change} error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword} disabled={loading} fullWidth required /><SubmitButton loading={loading}>Create account</SubmitButton></AuthForm><Typography align="center" variant="body2" sx={{ color: 'text.secondary' }}>Already have an account? <Link component={RouterLink} to="/login" state={location.state} sx={{ color: '#FEC29F', fontWeight: 800 }}>Log in</Link></Typography></AuthLayout>
}
