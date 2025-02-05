import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const paymentMethods = ["Cash", "Bank Transfer", "Credit Card", "Other"];

const MonthlyRentPayment = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [placeDetails, setPlaceDetails] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // State for payment method


  // Fetch agreements on component mount
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoadingBusinesses(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/agreements`);
        const formattedBusinesses = response.data.map((agreement) => ({
          id: agreement._id,
          businessId:agreement.businessId,
          businessName: agreement.businessDetails.businessName,
          assignedPlaceName: agreement.businessId.assignedPlace,
          monthlyRent: agreement.monthlyRent,
          place:`Building ${agreement.placeDetails.building}, Floor: ${agreement.placeDetails.floor}${placeDetails.partition ? `, Partition: ${agreement.placeDetails.partition}` : ''}`,
        }));
        setBusinesses(formattedBusinesses);
      } catch (err) {
        console.error("Error fetching businesses:", err.message);
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleBusinessChange = (businessId) => {
    console.log("businessId--------------",businessId);
    const business = businesses.find((b) => b.id === businessId);

    if (business) {
      setSelectedBusiness(business);
      setPlaceDetails(business.place || "N/A");
      setPaymentAmount(business.monthlyRent || "");
    } else {
      setSelectedBusiness(null);
      setPlaceDetails("");
      setPaymentAmount("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      businessId: selectedBusiness?.businessId,
      place: placeDetails,
      paymentAmount,
      paymentMethod: event.target.paymentMethod.value,
      paymentDate: event.target.paymentDate.value,
      month: event.target.month.value,
      remarks: event.target.remarks.value,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/payments`, data);
      console.log("Payment submitted successfully:", response.data);
      alert("Payment submitted successfully!");

          // Clear fields after successful submission
    setSelectedBusiness(null);
    setPlaceDetails("");
    setPaymentAmount("");
    setPaymentMethod(""); // Reset payment method dropdown
    event.target.reset(); // Reset the form

    } catch (err) {
      console.error("Error submitting payment:", err.message);
      alert("Failed to submit payment. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <Card elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" color="primary" textAlign="center" sx={{ mb: 3 }}>
          Monthly Rent Payment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Business Selection */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Select Business"
                name="businessId"
                select
                onChange={(e) => handleBusinessChange(e.target.value)}
                variant="outlined"
                required
                disabled={loadingBusinesses}
                value={selectedBusiness ? selectedBusiness.id : ""} // Explicitly bind value to selectedBusiness
              >
                {businesses.map((business) => (
                  <MenuItem key={business.id} value={business.id}>
                    {business.businessName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Place Details */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Place Details"
                value={placeDetails}
                variant="outlined"
                disabled
              />
            </Grid>

            {/* Payment Month */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Month"
                name="month"
                type="month"
                variant="outlined"
                required
              />
            </Grid>

            {/* Payment Amount */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Amount"
                name="paymentAmount"
                value={paymentAmount || ""}
                onChange={(e) => setPaymentAmount(e.target.value)}
                type="number"
                variant="outlined"
                required
                disabled
              />
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Method"
                name="paymentMethod"
                select
                variant="outlined"
                required
                value={paymentMethod} // Bind value to state
                onChange={(e) => setPaymentMethod(e.target.value)} // Update state on
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Payment Date */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Date"
                name="paymentDate"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={!selectedBusiness}
              >
                Submit Payment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default MonthlyRentPayment;
