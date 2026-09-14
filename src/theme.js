import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: { mode: 'dark', primary: { main: '#FEC29F', contrastText: '#1D2630' }, secondary: { main: '#FFDAE4', contrastText: '#1D2630' }, background: { default: '#1D2630', paper: '#26313D' }, text: { primary: '#FFFFFF', secondary: '#B9C0C7' }, error: { main: '#FF9CA8' }, success: { main: '#A8DDB5' } },
  typography: {
    fontFamily: 'var(--font-ui)',
    display: { fontFamily: 'var(--font-display)', fontSize: 'var(--type-display)', fontWeight: 750, letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-display)' },
    h1: { fontFamily: 'var(--font-ui)', fontSize: 'var(--type-page)', fontWeight: 700, letterSpacing: 'var(--tracking-heading)', lineHeight: 'var(--leading-heading)' },
    h2: { fontFamily: 'var(--font-ui)', fontSize: 'var(--type-section)', fontWeight: 650, letterSpacing: 'var(--tracking-heading)', lineHeight: 'var(--leading-heading)' },
    h3: { fontFamily: 'var(--font-ui)', fontSize: 'var(--type-card)', fontWeight: 650, letterSpacing: 'var(--tracking-heading)', lineHeight: 'var(--leading-tight)' },
    h4: { fontFamily: 'var(--font-ui)', fontSize: 'var(--type-card-sm)', fontWeight: 600, letterSpacing: 'var(--tracking-heading)', lineHeight: 'var(--leading-tight)' },
    body1: { fontSize: 'var(--type-body-md)', fontWeight: 400, lineHeight: 'var(--leading-body)' },
    body2: { fontSize: 'var(--type-body-sm)', fontWeight: 400, lineHeight: 'var(--leading-body)' },
    subtitle1: { fontSize: 'var(--type-body-lg)', fontWeight: 500, lineHeight: 'var(--leading-body)' },
    subtitle2: { fontSize: 'var(--type-body-sm)', fontWeight: 600, lineHeight: 'var(--leading-tight)' },
    button: { fontSize: 'var(--type-body-sm)', fontWeight: 600, letterSpacing: 'var(--tracking-ui)', textTransform: 'none' },
    caption: { fontSize: 'var(--type-caption)', fontWeight: 500, lineHeight: 'var(--leading-tight)' },
    overline: { fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 'var(--tracking-label)', lineHeight: 'var(--leading-tight)', textTransform: 'uppercase' }
  },
  shape: { borderRadius: 18 },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: 999, minHeight: 48, boxShadow: 'none' } } }, MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 14, backgroundColor: 'rgba(255,255,255,.06)' } } } } },
})
