import { useEffect, useMemo, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const formatCurrency = (value) => {
  return `Rs ${Number(value || 0).toLocaleString()}`;
};

const formatMonthLabel = (monthValue) => {
  if (!monthValue) return "N/A";

  const [year, month] = monthValue.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const MonthlyIncomeReport = () => {
  const currentYear = new Date().getFullYear().toString();

  const [rows, setRows] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async (selectedYear) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/income/monthly`,
        {
          params: { year: selectedYear },
        }
      );

      setRows(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch monthly income report:", err);
      setRows([]);
      setError("Failed to load monthly income report.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (year && year.length === 4) {
      fetchReport(year);
    } else {
      setRows([]);
    }
  }, [year, fetchReport]);

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

  const averageMonthlyIncome = useMemo(() => {
    if (!rows.length) return 0;
    return totalIncome / rows.length;
  }, [rows, totalIncome]);

  const bestMonth = useMemo(() => {
    if (!rows.length) return null;

    return rows.reduce((best, current) => {
      if (!best) return current;
      return Number(current.totalIncome || 0) > Number(best.totalIncome || 0)
        ? current
        : best;
    }, null);
  }, [rows]);

  const handleYearChange = (event) => {
    const value = event.target.value;
    setYear(value);
    setPage(0);
  };

  const handleRefresh = () => {
    if (year && year.length === 4) {
      fetchReport(year);
    }
  };

  return (
    <>
      <Helmet>
        <title>Monthly Income Report</title>
      </Helmet>

      <Box sx={{ backgroundColor: "background.default", pb: 3, pt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h4">Monthly Income Report</Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Total Income
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(totalIncome)}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Total Payments
                </Typography>
                <Typography variant="h6">{totalPayments}</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Average Monthly Income
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(averageMonthlyIncome)}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Best Month
                </Typography>
                <Typography variant="h6">
                  {bestMonth
                    ? formatMonthLabel(bestMonth.month)
                    : "N/A"}
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
                label="Year"
                type="number"
                value={year}
                onChange={handleYearChange}
                inputProps={{ min: 2000, max: 2100 }}
                sx={{ minWidth: 140 }}
              />

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
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Total Income</TableCell>
                    <TableCell align="right">Payment Count</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row, index) => (
                    <TableRow key={`${row.month}-${index}`} hover>
                      <TableCell>{formatMonthLabel(row.month)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.totalIncome)}
                      </TableCell>
                      <TableCell align="right">{row.paymentCount}</TableCell>
                    </TableRow>
                  ))}

                  {!paginatedRows.length && !loading && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No income data found for {year}
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