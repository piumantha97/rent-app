import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Divider
} from '@mui/material';

const AddBusinessForm = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [personName, setPersonName] = useState('');
  const [personAddress, setPersonAddress] = useState('');
  const [personId, setPersonId] = useState('');

  // Fetch places from the API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/places');
        setPlaces(response.data);
      } catch (err) {
        console.error('Error fetching places:', err.message);
        alert('Failed to fetch places.');
      }
    };

    fetchPlaces();
  }, []);

  const handleSubmit = async () => {
    const data = {
      assignedPlace: selectedPlace,
      businessName,
      contactNumber,
      personName,
      personAddress,
      personId
    };

    try {
      const response = await axios.post('http://localhost:5000/api/businesses', data);
      console.log('Response:', response.data);
      alert('Business added successfully!');

    // Clear all fields after submission
    setSelectedPlace('');
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
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={3}>
            {/* Assigned Place */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assign Place"
                select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                variant="outlined"
                required
              >
                {places.map((place) => (
                  <MenuItem key={place._id} value={place._id}>
                    {`${place.building} - Floor ${place.floor}${place.partition ? ` - ${place.partition}` : ''}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Business Name */}
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

            {/* Contact Number */}
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

            {/* Person Name */}
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

            {/* Person Address */}
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

            {/* Person ID */}
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

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!selectedPlace || !businessName || !contactNumber || !personName || !personId}
              >
                Add Business
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default AddBusinessForm;
