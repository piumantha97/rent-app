import { useEffect, useMemo, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const formatCurrency = (value) => {
  return `Rs ${Number(value || 0).toLocaleString()}`;
};

export const BusinessIncomeReport = () => {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [rows, setRows] = useState([]);
  const [filterType, setFilterType] = useState("month"); // month | year
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params =
        filterType === "month"
          ? { month }
          : { year };

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/income/by-business`,
        { params }
      );

      setRows(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch business income report:", err);
      setRows([]);
      setError("Failed to load business income report.");
    } finally {
      setLoading(false);
    }
  }, [filterType, month, year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  const totalIncome = useMemo(() => {
    return rows.reduce((sum, row) => sum + Number(row.totalIncome || 0), 0);
  }, [rows]);

  const totalPayments = useMemo(() => {
    return rows.reduce((sum, row) => sum + Number(row.paymentCount || 0), 0);
  }, [rows]);

  const topBusiness = useMemo(() => {
    if (!rows.length) return null;

    return rows.reduce((best, current) => {
      if (!best) return current;
      return Number(current.totalIncome || 0) > Number(best.totalIncome || 0)
        ? current
        : best;
    }, null);
  }, [rows]);

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchReport();
  };

  return (
    <>
      <Helmet>
        <title>Business Income Report</title>
      </Helmet>

      <Box sx={{ backgroundColor: "background.default", pb: 3, pt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h4">Income by Business</Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Total Income
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(totalIncome)}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Total Payments
                </Typography>
                <Typography variant="h6">{totalPayments}</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Top Business
                </Typography>
                <Typography variant="h6">
                  {topBusiness?.businessName || "N/A"}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                select
                label="Filter Type"
                value={filterType}
                onChange={handleFilterTypeChange}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="month">By Month</MenuItem>
                <MenuItem value="year">By Year</MenuItem>
              </TextField>

              {filterType === "month" ? (
                <TextField
                  label="Month"
                  type="month"
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setPage(0);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              ) : (
                <TextField
                  label="Year"
                  type="number"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(0);
                  }}
                  inputProps={{ min: 2000, max: 2100 }}
                  sx={{ minWidth: 140 }}
                />
              )}

              <Button variant="outlined" onClick={handleRefresh} disabled={loading}>
                Refresh
              </Button>

              <Box sx={{ ml: "auto" }}>
                <Typography variant="h6">
                  Total: {formatCurrency(totalIncome)}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {error && (
              <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {loading ? (
              <Box
                sx={{
                  p: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={24} />
                <Typography>Loading report...</Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Business Name</TableCell>
                    <TableCell>Place</TableCell>
                    <TableCell align="right">Total Income</TableCell>
                    <TableCell align="right">Payment Count</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row, index) => (
                    <TableRow key={`${row.businessId || row.businessName}-${index}`} hover>
                      <TableCell>{row.businessName || "N/A"}</TableCell>
                      <TableCell>{row.place || "N/A"}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.totalIncome)}
                      </TableCell>
                      <TableCell align="right">{row.paymentCount || 0}</TableCell>
                    </TableRow>
                  ))}

                  {!paginatedRows.length && !loading && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No business income data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            <Divider />

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};