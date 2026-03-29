import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Divider
} from '@mui/material';

const AddAgreementForm = () => {
  const [businesses, setBusinesses] = useState([]);
  const [places, setPlaces] = useState([]);

  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [agreementType, setAgreementType] = useState('new');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyMoney, setKeyMoney] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [businessRes, placeRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/businesses`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/places`)
        ]);

        setBusinesses(businessRes.data || []);
        setPlaces(placeRes.data || []);
      } catch (err) {
        console.error('Error loading data:', err.message);
        alert('Failed to load businesses or places');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const data = {
      businessId: selectedBusiness,
      placeId: selectedPlace,
      agreementType,
      startDate,
      endDate,
      keyMoney: agreementType === 'new' ? keyMoney : null,
      monthlyRent
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/agreements`, data);
      alert('Agreement added successfully!');

      setSelectedBusiness('');
      setSelectedPlace('');
      setAgreementType('new');
      setStartDate('');
      setEndDate('');
      setKeyMoney('');
      setMonthlyRent('');
    } catch (err) {
      console.error('Error saving agreement:', err.message);
      alert('Failed to save agreement. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" color="primary" textAlign="center" sx={{ mb: 3 }}>
          Add New Agreement
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Select Business"
              select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              required
            >
              {businesses.map((business) => (
                <MenuItem key={business._id} value={business._id}>
                  {business.businessName} ({business.personName})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Select Place"
              select
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              required
            >
              {places.map((place) => (
                <MenuItem key={place._id} value={place._id}>
                  {place.unitCode || `${place.building}-${place.floor}${place.partition ? `-${place.partition}` : ''}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Agreement Type"
              select
              value={agreementType}
              onChange={(e) => setAgreementType(e.target.value)}
              required
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="renewal">Renewal</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          {agreementType === 'new' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Key Money"
                type="number"
                value={keyMoney}
                onChange={(e) => setKeyMoney(e.target.value)}
                inputProps={{ min: 0, step: 'any' }}
                required
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Monthly Rent"
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              inputProps={{ min: 0, step: 'any' }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={
                !selectedBusiness ||
                !selectedPlace ||
                !startDate ||
                !endDate ||
                !monthlyRent ||
                (agreementType === 'new' && !keyMoney)
              }
            >
              Save Agreement
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default AddAgreementForm;