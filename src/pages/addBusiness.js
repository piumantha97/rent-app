import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  Divider
} from '@mui/material';

const AddBusinessForm = () => {
  const [businessName, setBusinessName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [personName, setPersonName] = useState('');
  const [personAddress, setPersonAddress] = useState('');
  const [personId, setPersonId] = useState('');

  const handleSubmit = async () => {
    const data = {
      businessName: businessName.trim(),
      contactNumber: contactNumber.trim(),
      personName: personName.trim(),
      personAddress: personAddress.trim(),
      personId: personId.trim()
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/businesses`, data);
      alert('Business added successfully!');

      setBusinessName('');
      setContactNumber('');
      setPersonName('');
      setPersonAddress('');
      setPersonId('');
    } catch (err) {
      console.error('Error saving business:', err.message);
      alert('Failed to add business. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" color="primary" textAlign="center" sx={{ mb: 3 }}>
          Add New Business
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              variant="outlined"
              type="tel"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Person Name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Person Address"
              value={personAddress}
              onChange={(e) => setPersonAddress(e.target.value)}
              variant="outlined"
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Person ID"
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!businessName || !contactNumber || !personName || !personId}
            >
              Add Business
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default AddBusinessForm;