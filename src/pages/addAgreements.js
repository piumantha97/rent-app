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

const AddAgreementForm = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [agreementType, setAgreementType] = useState('new'); // "new" or "renewal"
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyMoney, setKeyMoney] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');


  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
  // Load businesses from the API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/businesses`);
        setBusinesses(response.data);
      } catch (err) {
        console.error('Error fetching businesses:', err.message);
        alert('Failed to fetch businesses.');
      }
    };
    fetchBusinesses();
  }, []);

  const handleSubmit = async () => {
    const data = {
      businessId: selectedBusiness,
      agreementType,
      startDate,
      endDate,
      keyMoney: agreementType === 'new' ? keyMoney : null, // Key money only for new agreements
      monthlyRent
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/agreements`, data);
      console.log('Response:', response.data);
      alert('Agreement added successfully!');

  // Clear all fields after submission
  setSelectedBusiness('');
  setAgreementType('new'); // Reset to default value
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
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={3}>
            {/* Select Business */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Select Business"
                select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                variant="outlined"
                required
              >
                {businesses.map((business) => (
                  <MenuItem key={business._id} value={business._id}>
                    {business.businessName} ({business.personName})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Agreement Type */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agreement Type"
                select
                value={agreementType}
                onChange={(e) => setAgreementType(e.target.value)}
                variant="outlined"
                required
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="renewal">Renewal</MenuItem>
              </TextField>
            </Grid>

            {/* Start Date */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                variant="outlined"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                variant="outlined"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Key Money (only for new agreements) */}
            {agreementType === 'new' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Key Money"
                  value={keyMoney}
                  onChange={(e) => setKeyMoney(e.target.value)}
                  variant="outlined"
                  type="number"
                  required
                  inputProps={{
                    min: 0,
                    step: "any"
                  }}
                />
              </Grid>
            )}

            {/* Monthly Rent */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Monthly Rent"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                variant="outlined"
                type="number"
                required
                inputProps={{
                  min: 0,
                  step: "any"
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!selectedBusiness || !startDate || !endDate || !monthlyRent || (agreementType === 'new' && !keyMoney)}
              >
                Save Agreement
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default AddAgreementForm;
