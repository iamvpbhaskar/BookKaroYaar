import { Box, Chip, Stack, Typography } from '@mui/material'

export function BrandMark() { return <Typography component="div" className="auth-brand-mark">BookKaro<span style={{ color: '#FEC29F' }}>Yaar</span></Typography> }
export function AuthLayout({ eyebrow, title, description, children }) {
  return <Box className="auth-layout" sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { md: 'minmax(360px,.94fr) minmax(440px,1.06fr)' }, background: '#1D2630' }}>
    <Box sx={{ p: { xs: 3, sm: 5, lg: 7 }, display: 'flex', flexDirection: 'column', minHeight: { md: '100vh' }, position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg,#1D2630 15%,#303743 100%)' }}>
      <BrandMark /><Box sx={{ display: { xs: 'none', md: 'block' }, mt: 'auto', mb: 4, position: 'relative', zIndex: 1 }}><Chip label="PLAN. BOOK. SPLIT." sx={{ mb: 3, backgroundColor: '#FEC29F', color: '#1D2630', fontWeight: 900, letterSpacing: '.06em' }} /><Typography variant="h1" sx={{ fontSize: { md: 50, lg: 65 }, maxWidth: 480, mb: 2 }}>Same people.<br />New stories.</Typography><Typography sx={{ maxWidth: 390, color: '#C9CED3', lineHeight: 1.65 }}>Keep the group moving—from first idea to the final split.</Typography></Box>
      <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: '#FEC29F', opacity: .95, right: -142, bottom: -126 }} /><Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', width: 118, height: 118, borderRadius: '50%', background: '#FFDAE4', top: 116, right: 58, opacity: .9 }} />
    </Box>
    <Box component="main" sx={{ display: 'grid', placeItems: 'center', p: { xs: 3, sm: 5, md: 6 }, background: '#222C37' }}><Stack spacing={2.5} sx={{ width: '100%', maxWidth: 420 }}><Box sx={{ display: { md: 'none' } }}><BrandMark /></Box><Box><Typography variant="overline" sx={{ color: '#FEC29F', fontWeight: 900, letterSpacing: '.13em' }}>{eyebrow}</Typography><Typography variant="h2" sx={{ fontSize: { xs: 34, sm: 40 }, mt: .5 }}>{title}</Typography><Typography sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>{description}</Typography></Box>{children}</Stack></Box>
  </Box>
}
