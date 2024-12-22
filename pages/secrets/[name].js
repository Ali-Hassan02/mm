import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip , Grid , Card , CardContent 
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LockIcon from '@mui/icons-material/Lock';
import SecretCard from '@/components/SecretCard';
export default function ClassificationPage() {
  const router = useRouter();
  const { name } = router.query;
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState([]);
  const [allCategory , setAllCategory] = useState([])
  const [secrets, setSecrets] = useState([]);
  const [secretName, setSecretName] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // Declare the dialog state here
  
  // Update secretName when name changes
  useEffect(() => {
    if (name) {
      setSecretName(name); // Set the secret name when the URL query is ready
    }
  }, [name]);
  const handleDelete = (id) => {
    setSecrets(secrets.filter((secret) => secret._id !== id));
  };

  // Fetch secrets when secretName changes
  const getSecrets = async () => {
    try {
      const response = await fetch('/api/secret');
      const data = await response.json();
      

      // Filter secrets based on secretName
      const filteredSecrets = data.filter((d) => d.secret === secretName);
      
      setSecrets(filteredSecrets);

      fetch('/api/categories') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setAllCategory(data); // Set categories from API
      })

    } catch (error) {
      console.error('Error fetching secrets:', error);
    }
  };

  useEffect(() => {
    if (secretName) {
      getSecrets(); // Fetch secrets when secretName is available
    }
  }, [secretName]);

  const handleChange = (event) => {
    const value = event.target.value;
    setCategory(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFileName('');
    setCategory([]);
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (category.length === 0 || !selectedFile) {
      alert('Please fill all fields and select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileName', fileName);
    formData.append('category', category);

    const data = {
      secret: secretName, 
      category: category,
      fileName: fileName,
    };

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        alert('File upload failed!');
        return;
      }

      const secretResponse = await fetch('/api/secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (secretResponse.ok) {
        getSecrets()
        handleCloseDialog();
      } else {
        alert('Saving secret failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  if (!secretName) {
    return <p>Loading...</p>; // Render a loading state if secretName is not set
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, bgcolor: '#ffffff' }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4} sx={{ color: '#333', textTransform: 'uppercase' }}>
        {secretName?.replace('-', ' ')} Upload Page
      </Typography>
      <Typography variant="h6" textAlign="center" gutterBottom mb={6} sx={{ color: '#555', maxWidth: '700px' }}>
        Click the button below to upload a file for the "{secretName}" classification.
      </Typography>
      <Button variant="contained" startIcon={<UploadFileIcon />} onClick={handleOpenDialog} sx={{ backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', ':hover': { backgroundColor: '#0056b3' } }}>
        Upload File
      </Button>

      {/* Dialog for uploading file */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ width: '550px' }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                multiple
                value={category}
                onChange={handleChange}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={value} />
                    ))}
                    </Box>
                )}
                >
                {allCategory.map((category) => (
                    <MenuItem key={category._id} value={category.category}>
                    {category.category}
                    </MenuItem>
                ))}
                </Select>

            </FormControl>
            <TextField type="file" onChange={handleFileUpload} inputProps={{ accept: '.txt' }} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleUpload} variant="contained" color="primary">Upload</Button>
        </DialogActions>
      </Dialog>
    
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4} sx={{ marginTop: 6 }}>
        Secrets
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {secrets.map((secret) => (
          <Grid item  md={2.5} key={secret._id}>
            <SecretCard key={secret._id} secret={secret} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
