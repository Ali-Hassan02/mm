// pages/admin/dashboard.js

import React, { useEffect , useState} from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useRouter } from 'next/router';


export default function AdminDashboard() {
    const r = useRouter()
    const [classifications , setClassifications] = useState([])
  const handleUploadClick = (classification) => {
    console.log(classification)
    r.push(`/secrets/${classification}`)
    // Logic for file upload
  };

  useEffect(() => {
    fetch('/api/addSecret')
      .then((res) => res.json())
      .then((data) => {
        const defaultColors = [
          'linear-gradient(45deg, #FF5722, #FFC107)', // Bright orange-yellow
          'linear-gradient(45deg, #4CAF50, #8BC34A)', // Green shades
          'linear-gradient(45deg, #2196F3, #03A9F4)', // Blue shades
          'linear-gradient(45deg, #9C27B0, #E91E63)', // Purple-pink
          'linear-gradient(45deg, #607D8B, #455A64)', // Gray shades
        ];
  
        // Assign default gradients if missing
        const enhancedData = data.map((item, index) => ({
          ...item,
          gradient: item.gradient || defaultColors[index % defaultColors.length],
        }));
        console.log('YOO' , enhancedData)
        setClassifications(enhancedData);
      })
      .catch((err) => console.error('Error fetching classifications:', err));
  }, []);
  


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        sx={{
          color: '#333',
          textTransform: 'uppercase',
        }}
      >
        Admin Dashboard
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        gutterBottom
        mb={6}
        sx={{
          color: '#555',
          maxWidth: '600px',
        }}
      >
        Implement Mandatory Access Control (MAC). Use the buttons below to upload files under the appropriate classification level.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {classifications.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.label}>
            <Card
              sx={{
                boxShadow: 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                ':hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                  
                },
              }}
            >
              <CardContent
                sx={{
                  background: item.gradient,
                  color: '#fff',
                  textAlign: 'center',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  textTransform="uppercase"
                >
                  {item.secret}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  onClick={() => handleUploadClick(item.secret)}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#333',
                    fontWeight: 'bold',
                    ':hover': {
                      backgroundColor: '#e3e3e3',
                    },
                  }}
                >
                  Upload Secrets
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
