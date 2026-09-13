import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import { AuthLoadingScreen, GuestRoute, ProtectedRoute } from './features/auth/components/RouteGuards'
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage'
import { LoginPage } from './features/auth/pages/LoginPage'
import { SignupPage } from './features/auth/pages/SignupPage'
import { LandingPage } from './features/landing/pages/LandingPage'
import { AppShell } from './layout/AppShell'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { FutureModulePage } from './layout/FutureModulePage'
import { GroupsPage } from './features/groups/pages/GroupsPage'
import { GroupDetailPage } from './features/groups/pages/GroupDetailPage'

function AppRoutes() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
    <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
    <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
      <Route index element={<DashboardPage />} />
      <Route path="plans" element={<FutureModulePage title="My plans" />} />
      <Route path="groups" element={<GroupsPage />} />
      <Route path="groups/:groupId" element={<GroupDetailPage />} />
      <Route path="bookings" element={<FutureModulePage title="Bookings" />} />
      <Route path="expenses" element={<FutureModulePage title="Expenses" />} />
      <Route path="notifications" element={<FutureModulePage title="Notifications" />} />
      <Route path="settings" element={<FutureModulePage title="Settings" />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/app" replace />} />
  </Routes>
}

export default function App() {
  return <AuthProvider fallback={<AuthLoadingScreen />}><AppRoutes /></AuthProvider>
}
