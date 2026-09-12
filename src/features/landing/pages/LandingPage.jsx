import { useState } from 'react'
import { Box, Button, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import '../landing.css'

const navLinks = [{ label: 'Product', href: '#product' }, { label: 'How it works', href: '#story' }, { label: 'About', href: '#about' }]

function Brand() {
  return <Typography component={RouterLink} to="/" className="landing-brand">BookKaro<span>Yaar</span></Typography>
}

function ActionLink({ children, className = '', ...props }) {
  return <Button component={RouterLink} className={`landing-action ${className}`} endIcon={<ArrowForwardRoundedIcon />} {...props}>{children}</Button>
}

function ProductPoster() {
  return <Box className="product-poster" aria-label="A BookKaroYaar plan overview preview">
    <Box className="poster-scribble scribble-one">+ + +</Box>
    <Box className="poster-scribble scribble-two">★</Box>
    <Box className="poster-trip-card">
      <Box className="poster-card-head"><Typography variant="overline">GOA 2026</Typography><Chip size="small" label="OPEN" /></Box>
      <Typography className="poster-title">Sun, sea,<br />same people.</Typography>
      <Typography className="poster-meta">6 people / 4 days</Typography>
      <Box className="poster-people"><span>V</span><span>R</span><span>P</span><span>A</span><span>+2</span></Box>
      <Box className="poster-route"><span>Oct 18</span><i /><span>Oct 21</span></Box>
    </Box>
    <Box className="poster-balance-card"><Typography variant="caption">YOU OWE</Typography><Typography>₹1,200</Typography><Box>Split stays simple <ArrowForwardRoundedIcon fontSize="inherit" /></Box></Box>
    <Box className="poster-booking-card"><Typography variant="caption">BOOKED</Typography><Typography>Beach stay<br /><small>Confirmed · 6 guests</small></Typography><Box className="poster-ticket">B</Box></Box>
    <Box className="poster-vote">WHERE TO?<br /><strong>GOA / MOVIE / DINNER</strong></Box>
  </Box>
}

function ChaosBoard() {
  return <Box className="chaos-board" aria-label="Examples of group planning chaos">
    <Box className="chaos-message m-one">what time??</Box><Box className="chaos-message m-two">who paid?</Box><Box className="chaos-message m-three">send me the amount</Box><Box className="chaos-message m-four">📸 booking screenshot</Box><Box className="chaos-message m-five">37 unread messages</Box><Box className="chaos-arrow">↘</Box>
  </Box>
}

function StoryRibbon() {
  const steps = ['Idea', 'People', 'Plan', 'Book', 'Split', 'Done']
  return <Box className="story-ribbon">{steps.map((step, index) => <Box key={step} className={index === steps.length - 1 ? 'story-step is-done' : 'story-step'}><span>0{index + 1}</span><strong>{step}</strong>{index < steps.length - 1 && <ArrowForwardRoundedIcon />}</Box>)}</Box>
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()
  const startPath = user ? '/app' : '/signup'
  const closeMenu = () => setMenuOpen(false)
  return <Box className="landing-page">
    <Box component="header" className="landing-header"><Brand /><Box component="nav" className="landing-nav" aria-label="Primary navigation">{navLinks.map((link) => <Typography component="a" href={link.href} key={link.href}>{link.label}</Typography>)}</Box><Stack direction="row" spacing={1.25} className="landing-header-actions"><Button component={RouterLink} to={user ? '/app' : '/login'} color="inherit">{user ? 'My plans' : 'Log in'}</Button><ActionLink to={startPath} className="landing-header-cta">Start</ActionLink></Stack><IconButton className="landing-menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><MenuRoundedIcon /></IconButton></Box>
    <Drawer anchor="right" open={menuOpen} onClose={closeMenu} PaperProps={{ className: 'landing-drawer' }}><Box sx={{ p: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Brand /><IconButton onClick={closeMenu} aria-label="Close navigation"><CloseRoundedIcon /></IconButton></Box><Stack spacing={2.5} sx={{ mt: 7 }}>{navLinks.map((link) => <Typography component="a" href={link.href} onClick={closeMenu} key={link.href} className="landing-drawer-link">{link.label}</Typography>)}<Divider /><Button component={RouterLink} to={user ? '/app' : '/login'} onClick={closeMenu} color="inherit" sx={{ justifyContent: 'flex-start' }}>{user ? 'My plans' : 'Log in'}</Button><ActionLink to={startPath} onClick={closeMenu}>Start planning</ActionLink></Stack></Box></Drawer>
    <Box component="main">
      <Box className="landing-hero"><Box className="hero-copy"><Typography className="hero-kicker">PLAN. BOOK. SPLIT.</Typography><Typography variant="h1">PLAN LESS.<br /><em>LIVE MORE.</em></Typography><Typography className="hero-description">Trips, movie nights, dinners — without the group-chat chaos.</Typography><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}><ActionLink to={startPath} className="landing-primary-action">Start planning</ActionLink><Button component="a" href="#story" className="landing-quiet-action" endIcon={<NorthEastRoundedIcon />}>See how it works</Button></Stack></Box><ProductPoster /><Typography className="hero-side-note">LESS<br />CHAOS<br /><span>MORE<br />MEMORIES</span></Typography></Box>
      <Box id="product" className="landing-chaos-section"><Box><Typography className="section-label">THE GROUP CHAT PROBLEM</Typography><Typography variant="h2">The plan is never<br />the problem.</Typography><Typography>The chaos around it is. Keep every “what time?”, booking screenshot and “who paid?” in one place.</Typography></Box><ChaosBoard /></Box>
      <Box id="story" className="landing-story-section"><Box className="story-title"><Typography className="section-label">ONE GROUP. ONE PLACE.</Typography><Typography variant="h2">From “we should”<br />to <em>we did.</em></Typography></Box><StoryRibbon /><Box className="story-product-fragment"><Box><Typography variant="overline">FRIDAY NIGHT / 7:30 PM</Typography><Typography>Movie, food, and zero spreadsheet energy.</Typography></Box><Chip label="ALL SET" /><Box className="story-avatars"><span>V</span><span>R</span><span>P</span><span>A</span></Box></Box></Box>
      <Box id="about" className="landing-closing"><Box className="closing-burst">GOOD<br />PLANS<br />ONLY</Box><Box><Typography className="section-label">BOOKKAROY AAR</Typography><Typography variant="h2">Better people.<br /><em>Better plans.</em></Typography><Typography>Plan together. Book together. Split effortlessly.</Typography><ActionLink to={startPath} className="landing-primary-action">Join the club</ActionLink></Box></Box>
    </Box>
    <Box component="footer" className="landing-footer"><Box><Brand /><Typography>People first. Plans second.<br />The good kind of organized.</Typography></Box><Box className="footer-links"><Typography component={RouterLink} to="/login">Log in</Typography><Typography component={RouterLink} to="/signup">Start planning</Typography><Typography component="a" href="#product">Product</Typography><Typography component="a" href="#story">How it works</Typography></Box><Typography className="footer-note">© 2026 BookKaroYaar</Typography></Box>
  </Box>
}
