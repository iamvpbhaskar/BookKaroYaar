import { useState } from 'react'
import { Avatar, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context/AuthContext'
import './appShell.css'

const navItems = [
  { label: 'Dashboard', to: '/app', icon: <DashboardRoundedIcon />, end: true },
  { label: 'My Plans', to: '/app/plans', icon: <EventNoteRoundedIcon /> },
  { label: 'Groups', to: '/app/groups', icon: <GroupsRoundedIcon /> },
  { label: 'Bookings', to: '/app/bookings', icon: <ReceiptLongRoundedIcon /> },
  { label: 'Expenses', to: '/app/expenses', icon: <ReceiptLongRoundedIcon /> },
  { label: 'Notifications', to: '/app/notifications', icon: <NotificationsRoundedIcon /> },
]

function Brand({ compact = false }) { return <Typography className="shell-brand">{compact ? 'BK' : <>BookKaro<span>Yaar</span></>}</Typography> }
function InitialAvatar({ user }) { return <Avatar src={user?.photoURL || undefined} className="shell-avatar">{(user?.displayName || user?.email || 'Y').slice(0, 1).toUpperCase()}</Avatar> }

function Navigation({ onNavigate, expanded = true }) {
  return <Box component="nav" className="shell-nav" aria-label="App navigation"><List disablePadding>{navItems.map((item) => <ListItemButton key={item.to} component={NavLink} to={item.to} end={item.end} onClick={onNavigate} title={!expanded ? item.label : undefined} aria-label={!expanded ? item.label : undefined} className={({ isActive }) => `shell-nav-item ${isActive ? 'is-active' : ''}`}><ListItemIcon>{item.icon}</ListItemIcon>{expanded && <ListItemText primary={item.label} />}</ListItemButton>)}</List><Box className="shell-nav-bottom"><ListItemButton component={NavLink} to="/app/settings" onClick={onNavigate} title={!expanded ? 'Settings' : undefined} aria-label={!expanded ? 'Settings' : undefined} className={({ isActive }) => `shell-nav-item ${isActive ? 'is-active' : ''}`}><ListItemIcon><SettingsRoundedIcon /></ListItemIcon>{expanded && <ListItemText primary="Settings" />}</ListItemButton></Box></Box>
}

export function AppShell() {
  const { user, logOut } = useAuth(); const navigate = useNavigate(); const [drawerOpen, setDrawerOpen] = useState(false); const [menuAnchor, setMenuAnchor] = useState(null); const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const logout = async () => { setMenuAnchor(null); await logOut(); navigate('/login', { replace: true }) }
  return <Box className="app-shell"><Box component="aside" className={`shell-sidebar ${sidebarExpanded ? 'is-expanded' : 'is-collapsed'}`}><Box className="shell-sidebar-header"><Brand compact={!sidebarExpanded} /><IconButton className="shell-sidebar-toggle" onClick={() => setSidebarExpanded((expanded) => !expanded)} aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'} aria-expanded={sidebarExpanded}>{sidebarExpanded ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}</IconButton></Box><Navigation expanded={sidebarExpanded} /><Box className="shell-sidebar-cta">{sidebarExpanded ? <><Typography>Got an idea?</Typography><Button startIcon={<AddRoundedIcon />} onClick={() => navigate('/app')}>Start a plan</Button></> : <IconButton aria-label="Start a plan" title="Start a plan" onClick={() => navigate('/app')}><AddRoundedIcon /></IconButton>}</Box><Button className="shell-profile" onClick={(event) => setMenuAnchor(event.currentTarget)} aria-label={!sidebarExpanded ? 'Open profile menu' : undefined}><InitialAvatar user={user} />{sidebarExpanded && <Box><Typography>{user?.displayName || 'Your profile'}</Typography><Typography>{user?.email}</Typography></Box>}</Button></Box><Box className="shell-main"><Box component="header" className="shell-topbar"><IconButton className="shell-menu-button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation"><MenuRoundedIcon /></IconButton><Box className="shell-mobile-brand"><Brand /></Box><Stack direction="row" spacing={1}><Button className="shell-top-action" startIcon={<AddRoundedIcon />} onClick={() => navigate('/app')}>Start a plan</Button><IconButton className="shell-user-button" onClick={(event) => setMenuAnchor(event.currentTarget)} aria-label="Open profile menu"><InitialAvatar user={user} /></IconButton></Stack></Box><Box component="main" className="shell-content"><Outlet /></Box></Box><Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ className: 'shell-drawer' }}><Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}><Brand /><Navigation onNavigate={() => setDrawerOpen(false)} /><Box className="shell-sidebar-cta"><Typography>Got an idea?</Typography><Button startIcon={<AddRoundedIcon />} onClick={() => { setDrawerOpen(false); navigate('/app') }}>Start a plan</Button></Box></Box></Drawer><Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)} PaperProps={{ className: 'shell-user-menu' }}><MenuItem onClick={logout}><LogoutRoundedIcon /> Log out</MenuItem></Menu></Box>
}
