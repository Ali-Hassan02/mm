import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Navbar from '@/components/Navbar';

const FileDisplay = () => {
  const files = [
    { name: 'Document1.pdf', type: 'PDF', size: '1.2 MB' },
    { name: 'Report.xlsx', type: 'Excel', size: '2.3 MB' },
    { name: 'Presentation.pptx', type: 'PPT', size: '3.1 MB' },
    { name: 'Image1.jpg', type: 'Image', size: '4.5 MB' },
    { name: 'Code.js', type: 'JavaScript', size: '1.1 MB' },
    { name: 'Notes.txt', type: 'Text', size: '500 KB' },
  ];

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          padding: '20px',
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: '900px',
          }}
        >
          {files.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <InsertDriveFileIcon sx={{ fontSize: 60, color: '#1976d2' }} />
                <CardContent>
                  <Typography variant="h6" textAlign="center" gutterBottom>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Type: {file.type}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Size: {file.size}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default FileDisplay;
