import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: { mode: 'dark', primary: { main: '#FEC29F', contrastText: '#1D2630' }, secondary: { main: '#FFDAE4', contrastText: '#1D2630' }, background: { default: '#1D2630', paper: '#26313D' }, text: { primary: '#FFFFFF', secondary: '#B9C0C7' }, error: { main: '#FF9CA8' }, success: { main: '#A8DDB5' } },
  typography: { fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', h1: { fontWeight: 800, letterSpacing: '-0.055em', lineHeight: .98 }, h2: { fontWeight: 800, letterSpacing: '-.04em' }, button: { fontWeight: 800, textTransform: 'none' } },
  shape: { borderRadius: 18 },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: 999, minHeight: 48, boxShadow: 'none' } } }, MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 14, backgroundColor: 'rgba(255,255,255,.06)' } } } } },
})
