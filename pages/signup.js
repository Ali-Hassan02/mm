import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Modal,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const SecretManager = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [category, setCategory] = useState([]);
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [allCategory , setAllCategory] = useState([])
  const [secretLevels, setSecretLevels] = useState([]); 

  // Fetch existing secrets
  const handleChange = (event) => {
    const value = event.target.value;
    setCategory(typeof value === 'string' ? value.split(',') : value);
  };

  const fetchSecretLevels = async () => {
    try {
      const response = await fetch('/api/addSecret');
      const data = await response.json();
      setSecretLevels(data); // Update state with fetched secret levels
    } catch (error) {
      console.error('Error fetching secret levels:', error);
    }
  };

  useEffect(() => {
    const fetchSecrets = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/signup');
        const data = await response.json();
        setSecrets(data);

        fetch('/api/categories') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setAllCategory(data); // Set categories from API
      })

      } catch (error) {
        console.error('Error fetching secrets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecrets();
    fetchSecretLevels()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email , secret , category, password  }),
      });

      const result = await response.json();
      if (response.ok) {
        setSecrets([...secrets, result.secret]); // Update UI
        setSuccessModal(true);
        setEmail('');
        setPassword('');
        setSecret('');
        setCategory([]);
      } else {
        alert(result.error || 'Error creating secret');
      }
    } catch (error) {
      console.error('Error submitting secret:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'secret', headerName: 'Secret Level', flex: 1 },
    { field: 'category', headerName: 'Categories', flex: 1, renderCell: (params) => params.value.join(', ') },
    { field: 'rank', headerName: 'Rank', flex: 1 },
  ];

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Secret Manager
      </Typography>

      {/* Form Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: '#fff',
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
          marginBottom: 4,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
                <InputLabel>Secret Level</InputLabel>
                <Select
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                >
                {secretLevels.map((level) => (
                    <MenuItem key={level._id} value={level.secret}>
                    {level.secret}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Categories</InputLabel>
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
          </Grid>
        </Grid>
        <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
                marginTop: { xs: 2, sm: 4, md: 6 }, // Adjust margin for different screen sizes
                display: 'block',
                margin: '0 auto',
            }}
            disabled={loading}
            >
            {loading ? <CircularProgress size={24} /> : 'Add User'}
        </Button>

      </Box>

      {/* Secrets DataGrid */}
      <Box
        sx={{
          height: 400,
          backgroundColor: '#fff',
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <DataGrid
          rows={secrets.map((secret) => ({ ...secret, id: secret._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>

      {/* Success Modal */}
      <Modal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: 'white',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography id="success-modal-title" variant="h6" color="primary">
            Success!
          </Typography>
          <Typography id="success-modal-description" sx={{ mt: 2 }}>
            User added successfully.
          </Typography>
          <Button
            onClick={() => setSuccessModal(false)}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default SecretManager;
