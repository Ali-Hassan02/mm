// pages/login.js

import { useState , useEffect } from 'react';
import { Button, TextField, Grid, Typography, Container, Box, Avatar, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if the token exists on the login page
    const checkToken = async () => {
      try {
        const response = await fetch('/api/getToken');
        if (response.ok) {
          // If a valid token is found, redirect to the admin dashboard
          router.push('/admin-dashboard');
        }
      } catch (error) {
        console.log('No token or invalid token, continue on login page');
      }
    };

    checkToken();
  }, [router]);

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    
    // Simulate login process (replace with actual authentication logic)
    setTimeout(async () => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Correct Content-Type
          },
          body: JSON.stringify({ email, password }), // Pass email and password
        });
    
        const data = await response.json(); // Parse JSON response
    
        if (response.ok) {
          router.push('/admin-dashboard')
        } else {
          console.error('Login failed:', data.message); // Handle failure
        }
      } catch (error) {
        console.error('Error during login:', error); // Handle network errors
      } finally {
        setLoading(false); // Ensure loading is turned off in all cases
      }
    }, 1000);
    
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          borderRadius: 2,
          boxShadow: 3,
          padding: 4,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        
        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  height: 48,
                  borderRadius: 2,
                  boxShadow: loading ? 'none' : '0px 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
