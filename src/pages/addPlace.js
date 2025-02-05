import React, { useState } from 'react';
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

const buildings = ['A', 'B', 'C', 'D','Lankatilaka']; // Predefined buildings
const floors = ['1', '2', '3', '4', '5']; // Fixed floors
const partitions = ['P1', 'P2', 'P3', 'P4']; // Fixed partitions

const AddPlaceForm = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedPartition, setSelectedPartition] = useState('');
  const [currentMeter, setCurrentMeter] = useState('');
  const [waterMeter, setWaterMeter] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async () => {
    const data = {
      building: selectedBuilding,
      floor: selectedFloor,
      partition: selectedPartition || null, // Partition is optional
      currentMeter,
      waterMeter,
      squareFeet,
      address
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/places`, data);
      console.log('Response:', response.data);
      alert('Place added successfully!');

       // Clear all fields after submission
    setSelectedBuilding('');
    setSelectedFloor('');
    setSelectedPartition('');
    setCurrentMeter('');
    setWaterMeter('');
    setSquareFeet('');
    setAddress('');
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
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={3}>
            {/* Select Building */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Select Building"
                select
                value={selectedBuilding}
                onChange={(e) => {
                  setSelectedBuilding(e.target.value);
                  setSelectedFloor(''); // Reset floor when building changes
                  setSelectedPartition(''); // Reset partition when building changes
                }}
                variant="outlined"
              >
                {buildings.map((building) => (
                  <MenuItem key={building} value={building}>
                    Building {building}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Floor */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Select Floor"
                select
                value={selectedFloor}
                onChange={(e) => {
                  setSelectedFloor(e.target.value);
                  setSelectedPartition(''); // Reset partition when floor changes
                }}
                variant="outlined"
                disabled={!selectedBuilding} // Disable if no building selected
              >
                {floors.map((floor) => (
                  <MenuItem key={floor} value={floor}>
                    Floor {floor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Partition (Optional) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Select Partition (Optional)"
                select
                value={selectedPartition}
                onChange={(e) => setSelectedPartition(e.target.value)}
                variant="outlined"
                disabled={!selectedFloor} // Disable if no floor selected
              >
                {partitions.map((partition) => (
                  <MenuItem key={partition} value={partition}>
                    {partition}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Current Meter */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Meter ID"
                value={currentMeter}
                onChange={(e) => setCurrentMeter(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            {/* Water Meter */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Water Meter ID"
                value={waterMeter}
                onChange={(e) => setWaterMeter(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            {/* Square Feet */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Square Feet"
                value={squareFeet}
                onChange={(e) => setSquareFeet(e.target.value)}
                variant="outlined"
                type="number"
                required
                inputProps={{
                  min: 1, // Prevent negative or zero values
                  step: "any"
                }}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  !selectedBuilding ||
                  !selectedFloor ||
                  !currentMeter ||
                  !waterMeter ||
                  !squareFeet
                }
              >
                Add Place
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default AddPlaceForm;
