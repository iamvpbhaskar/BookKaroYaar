import { Box, CircularProgress } from '@mui/material'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export function AuthLoadingScreen() { return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: 'background.default' }}><CircularProgress color="primary" aria-label="Loading your session" /></Box> }
export function ProtectedRoute({ children }) { const { user } = useAuth(); const location = useLocation(); return user ? children : <Navigate to="/login" replace state={{ from: location }} /> }
export function GuestRoute({ children }) { const { user } = useAuth(); return user ? <Navigate to="/app" replace /> : children }
