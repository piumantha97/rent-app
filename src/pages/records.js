import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  TablePagination,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RecordsTable } from "../components/records-table";
import axios from "axios";

export const Records = () => {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [payments, setPayments] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [businessResponse, paymentResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/businesses`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payments`),
        ]);

        setBusinesses(businessResponse.data || []);
        setPayments(paymentResponse.data || []);
      } catch (error) {
        console.error("Error fetching records data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPayments = useMemo(() => {
    if (!selectedBusiness) return payments;

    return payments.filter((payment) => {
      return (
        payment.businessId?._id === selectedBusiness ||
        payment.businessDetails?._id === selectedBusiness
      );
    });
  }, [payments, selectedBusiness]);

  const paginatedPayments = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPayments.slice(start, end);
  }, [filteredPayments, page, rowsPerPage]);

  const handleBusinessFilterChange = (businessId) => {
    setSelectedBusiness(businessId);
    setPage(0);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddPayment = () => {
    navigate("/payments/add");
  };

  return (
    <>
      <Helmet>
        <title>Records | Dashboard</title>
      </Helmet>

      <Box sx={{ backgroundColor: "background.default", pb: 3, pt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ alignItems: "center", display: "flex", mb: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Payment Records
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={handleAddPayment}
            >
              Add Payment
            </Button>
          </Box>

          <Card variant="outlined">
            <Box sx={{ display: "flex", p: 2 }}>
              <TextField
                fullWidth
                select
                label="Filter by Business"
                value={selectedBusiness}
                onChange={(e) => handleBusinessFilterChange(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">All Businesses</MenuItem>
                {businesses.map((business) => (
                  <MenuItem key={business._id} value={business._id}>
                    {business.businessName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Divider />

            {loading ? (
              <Box sx={{ p: 3 }}>
                <Typography>Loading payment records...</Typography>
              </Box>
            ) : (
              <RecordsTable records={paginatedPayments} />
            )}

            <Divider />

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPayments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};