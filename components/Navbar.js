import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // For logout icon
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // For add user icon

export default function Navbar() {
  const router = useRouter();

  // Handle Logout functionality

  const handleLogout = async () => {
    try {
      // Make a POST request to the logout API to clear the token
      const response = await fetch('/api/clearToken', {
        method: 'POST',
      });

      if (response.ok) {
        // If the logout is successful, redirect to the login page
        router.push('/');
      } else {
        // Handle logout failure (optional)
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle "Add User" button click
  const handleAddUser = () => {
    router.push('/signup'); // Redirect to the add user page
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<PersonAddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
