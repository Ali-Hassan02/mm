// pages/_app.js

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from '@/components/Layout';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize primary color
    },
    background: {
      default: '#f5f5f5', // Light background color for the page
    },
    text: {
      primary: '#333', // Dark text color for better readability
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
    body2: {
      fontWeight: 400,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
