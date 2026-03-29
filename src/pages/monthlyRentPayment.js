import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

const paymentMethods = ["Cash", "Bank Transfer", "Credit Card", "Other"];

const MonthlyRentPayment = () => {
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [placeDetails, setPlaceDetails] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/agreements`
      );

      const formatted = (res.data || []).map((agreement) => ({
        id: agreement._id,
        agreementId: agreement._id,
        businessName: agreement.businessDetails?.businessName || "N/A",
        monthlyRent: agreement.monthlyRent || "",
        place: agreement.placeDetails?.unitCode
          ? agreement.placeDetails.unitCode
          : agreement.placeDetails
          ? `Building ${agreement.placeDetails.building}, Floor ${agreement.placeDetails.floor}${
              agreement.placeDetails.partition
                ? ` - ${agreement.placeDetails.partition}`
                : ""
            }`
          : "N/A",
      }));

      setAgreements(formatted);
    } catch (err) {
      console.error("Error fetching agreements:", err.message);
      alert("Failed to load agreements");
    } finally {
      setLoading(false);
    }
  };

  const handleAgreementChange = (id) => {
    const agreement = agreements.find((a) => a.id === id);

    if (agreement) {
      setSelectedAgreement(agreement);
      setPlaceDetails(agreement.place || "N/A");
      setPaymentAmount(agreement.monthlyRent || "");
    } else {
      setSelectedAgreement(null);
      setPlaceDetails("");
      setPaymentAmount("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAgreement) {
      alert("Please select a tenant");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const data = {
      agreementId: selectedAgreement.agreementId,
      paymentAmount: Number(paymentAmount),
      paymentMethod,
      paymentDate: e.target.paymentDate.value,
      month: e.target.month.value,
      remarks: e.target.remarks.value,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments`,
        data
      );

      alert("Payment submitted successfully!");

      setSelectedAgreement(null);
      setPlaceDetails("");
      setPaymentAmount("");
      setPaymentMethod("");
      e.target.reset();
    } catch (err) {
      console.error("Error submitting payment:", err.message);
      alert("Failed to submit payment");
    }
  };

  return (
    <Container maxWidth="md">
      <Card elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          textAlign="center"
          color="primary"
          sx={{ mb: 3 }}
        >
          Monthly Rent Payment
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Select Tenant"
                select
                value={selectedAgreement ? selectedAgreement.id : ""}
                onChange={(e) => handleAgreementChange(e.target.value)}
                required
                disabled={loading}
              >
                {agreements.map((agreement) => (
                  <MenuItem key={agreement.id} value={agreement.id}>
                    {agreement.businessName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Place"
                value={placeDetails}
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Month"
                name="month"
                type="month"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                type="number"
                variant="outlined"
                required
                inputProps={{
                  min: 0,
                  step: "any",
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Method"
                select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                variant="outlined"
                required
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

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

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={!selectedAgreement || loading}
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