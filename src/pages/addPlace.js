import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  Divider,
  MenuItem
} from '@mui/material';

const AddPlaceForm = () => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [partition, setPartition] = useState('');
  const [currentMeter, setCurrentMeter] = useState('');
  const [waterMeter, setWaterMeter] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('vacant');

  const unitCode = `${building}-${floor}${partition ? `-${partition}` : ''}`;

  const handleSubmit = async () => {
    const data = {
      building: building.trim(),
      floor: floor.trim(),
      partition: partition.trim() || null,
      unitCode,
      currentMeter: currentMeter.trim(),
      waterMeter: waterMeter.trim(),
      squareFeet: Number(squareFeet),
      address: address.trim(),
      status
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/places`, data);
      alert('Place added successfully!');

      setBuilding('');
      setFloor('');
      setPartition('');
      setCurrentMeter('');
      setWaterMeter('');
      setSquareFeet('');
      setAddress('');
      setStatus('vacant');
    } catch (err) {
      console.error('Error saving place:', err.message);
      alert('Failed to add place. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" color="primary" textAlign="center" sx={{ mb: 3 }}>
          Add New Place
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Building"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="Example: A or Lankatilaka"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="Example: 1, 2, Ground"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Partition (Optional)"
              value={partition}
              onChange={(e) => setPartition(e.target.value)}
              placeholder="Example: P1, Shop-02"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Unit Code"
              value={unitCode}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Meter ID"
              value={currentMeter}
              onChange={(e) => setCurrentMeter(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Water Meter ID"
              value={waterMeter}
              onChange={(e) => setWaterMeter(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Square Feet"
              value={squareFeet}
              onChange={(e) => setSquareFeet(e.target.value)}
              type="number"
              required
              inputProps={{ min: 1, step: 'any' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Status"
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="vacant">Vacant</MenuItem>
              <MenuItem value="occupied">Occupied</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!building || !floor || !currentMeter || !waterMeter || !squareFeet}
            >
              Add Place
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default AddPlaceForm;