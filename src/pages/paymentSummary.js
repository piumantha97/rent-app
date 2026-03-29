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
import dayjs from "dayjs";
import axios from "axios";
import { RecordsTable } from "../components/records-table";

export const PaymentSummary = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchPayments();
    fetchBusinesses();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/businesses`);
      setBusinesses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FILTER LOGIC (clean)
const filteredPayments = useMemo(() => {
  return payments.filter((payment) => {
    if (selectedBusiness) {
      if (payment.businessDetails?._id !== selectedBusiness) {
        return false;
      }
    }

    if (selectedMonthYear) {
      const [year, month] = selectedMonthYear.split("-");
      const paymentDate = dayjs(payment.paymentDate);

      if (
        paymentDate.year() !== parseInt(year, 10) ||
        paymentDate.month() !== parseInt(month, 10) - 1
      ) {
        return false;
      }
    }

    return true;
  });
}, [payments, selectedBusiness, selectedMonthYear]);

  const paginatedPayments = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredPayments.slice(start, start + rowsPerPage);
  }, [filteredPayments, page, rowsPerPage]);

  const handleAddPayment = () => {
    navigate("/payments/add");
  };

  return (
    <>
      <Helmet>
        <title>Payment Records</title>
      </Helmet>

      <Box sx={{ backgroundColor: "background.default", pb: 3, pt: 8 }}>
        <Container maxWidth="lg">

          <Box sx={{ display: "flex", mb: 3 }}>
            <Typography variant="h4">Payment Records</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={handleAddPayment}>
              Add Payment
            </Button>
          </Box>

          <Card>

            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, p: 2 }}>
              <TextField
                fullWidth
                select
                label="Filter by Business"
                value={selectedBusiness}
                onChange={(e) => {
                  setSelectedBusiness(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">All</MenuItem>
                {businesses.map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.businessName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                type="month"
                label="Filter by Month"
                value={selectedMonthYear}
                onChange={(e) => {
                  setSelectedMonthYear(e.target.value);
                  setPage(0);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Divider />

            {/* Table */}
            <RecordsTable records={paginatedPayments} />

            <Divider />

            <TablePagination
              component="div"
              count={filteredPayments.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />

          </Card>
        </Container>
      </Box>
    </>
  );
};