import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Backdrop, Button ,  CircularProgress, Fade , Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from '@mui/system';

const SecretCard = ({ secret, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const [fadeOut, setFadeOut] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleClickOpen = () => {
    setFileUrl(`/uploads/${secret.fileName}`);
    loadFileContent(secret.fileName);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Simulating loading of text file content
  const loadFileContent = (fileName) => {
    fetch(`/uploads/${fileName}`)
      .then((response) => response.text())
      .then((content) => {
        setFileContent(content);
      })
      .catch((error) => console.error('Error loading file content:', error));
  };

  const handleUpdateFile = () => {
    fetch('/api/update-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: secret.fileName, newContent: fileContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'File updated successfully') {
          alert('File content updated successfully!');
          setIsEditing(false);
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to update the file.');
      });
  };

  // Styled Card with dynamic fade-out
  const AnimatedCard = styled(Card)(({ theme, fadeOut }) => ({
    transition: 'opacity 0.5s ease-out',
    opacity: fadeOut ? 0 : 1,
    pointerEvents: fadeOut ? 'none' : 'auto',
  }));

  // Handle deletion
  const handleDelete = async () => {
    try {
      setShowBackdrop(true); // Show the feedback overlay

      // Call API to delete secret
      const response = await fetch(`/api/delete-secret?id=${secret._id}`, { method: 'DELETE' });
      const result = await response.json();

      if (result.success) {
        // Trigger card fade-out after 1 second to allow feedback display
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => onDelete(secret._id), 500); // Notify parent to remove the card
        }, 1000);

        // Hide feedback overlay after 2 seconds
        setTimeout(() => setShowBackdrop(false), 2000);
      } else {
        alert('Failed to delete secret');
        setShowBackdrop(false);
      }
    } catch (error) {
      console.error('Error deleting secret:', error);
      alert('An error occurred while deleting the secret.');
      setShowBackdrop(false);
    }
  };

  return (
    <>
      <AnimatedCard
        fadeOut={fadeOut}
        sx={{
          position: 'relative',
          maxWidth: 1000,
          height: '200px',
          width : 250 , 
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: '#ffffff',
          '&:hover': {
            boxShadow: 6,
            cursor: 'pointer',
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClickOpen}
      >
        <CardContent>
          {/* Lock Icon */}
          <Box sx={{ position: 'absolute', top: 16, right: 16}}>
            <LockIcon fontSize="large" sx={{ color: '#ff6f00' }} />
          </Box>

          {/* Delete Icon */}
          {isHovered && (
            <IconButton
              sx={{
                position: 'absolute',
                top: 130,
                right: 9,
                color: 'red',
                zIndex: 10,
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}

          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Secret: {secret.secret}
          </Typography>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '1.0rem' }}>
              <strong>File Name:</strong> {secret.fileName}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '1.0rem' }}>
              <strong>Categories:</strong>
            </Typography>

            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {secret.category.map((cat, index) => (
                <Chip key={index} label={cat} color="primary" />
              ))}
            </Box>
          </Box>
        </CardContent>
      </AnimatedCard>

      {/* Backdrop with Feedback */}
      <Backdrop
        open={showBackdrop}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Fade in={showBackdrop} timeout={500}>
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'green' }} />
            <Typography variant="h6" sx={{ mt: 2, color: '#fff' }}>
              Secret Deleted Successfully!
            </Typography>
          </Box>
        </Fade>
      </Backdrop>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            width: '80%',
            maxWidth: '900px',
          },
        }}
      >
        <DialogTitle>Secret File: {secret.fileName}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Here is the file you requested:
          </Typography>

          <TextField
            multiline
            fullWidth
            variant="outlined"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            sx={{ marginBottom: '16px', height: '200px', fontFamily: 'monospace' }}
            disabled={!isEditing}
          />
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleUpdateFile} sx={{ mt: 2, mb: 2 }}>
              Save Changes
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={() => setIsEditing(true)} sx={{ mt: 2, mb: 2 }}>
              Edit File
            </Button>
          )}
          <Button onClick={handleCloseDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecretCard;
