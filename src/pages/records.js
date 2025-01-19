import { useState, useEffect } from "react";
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
import { RecordsTable } from "../components/records-table";

import axios from "axios";

export const Records = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Fetch businesses
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/businesses");
        setBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    // Fetch payments
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/payments");
        setPayments(response.data);
        setFilteredPayments(response.data); // Initial load shows all payments
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchBusinesses();
    fetchPayments();
  }, []);

  const handleBusinessFilterChange = (businessId) => {
    setSelectedBusiness(businessId);

    if (businessId) {
      const filtered = payments.filter(
        (payment) => payment.businessId?._id === businessId
      );
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments); // Show all if no business is selected
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <Button color="primary" size="large" variant="contained">
              Add Payment
            </Button>
          </Box>
          <Card variant="outlined">
            <Box sx={{ display: "flex", p: 2 }}>
              {/* Business Filter */}
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
            <RecordsTable
              records={filteredPayments.slice(
                page * rowsPerPage,
                (page + 1) * rowsPerPage
              )}
            />
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
