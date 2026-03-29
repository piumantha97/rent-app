import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Card,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import axios from "axios";

const statusColor = {
  Paid: "success",
  Partial: "warning",
  Unpaid: "error",
};

export const UnpaidRentReport = () => {
  const [rows, setRows] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchReport(month);
  }, [month]);

  const fetchReport = async (selectedMonth) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/reports/unpaid-rent?month=${selectedMonth}`
      );
      setRows(res.data || []);
    } catch (err) {
      console.error("Failed to fetch unpaid rent report:", err.message);
      setRows([]);
    }
  };

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  return (
    <>
      <Helmet>
        <title>Unpaid Rent Report</title>
      </Helmet>

      <Box sx={{ backgroundColor: "background.default", pb: 3, pt: 8 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h4">Unpaid Rent Report</Typography>
          </Box>

          <Card>
            <Box sx={{ p: 2, display: "flex", gap: 2 }}>
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
            </Box>

            <Divider />

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Place</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Monthly Rent</TableCell>
                  <TableCell>Paid Amount</TableCell>
                  <TableCell>Balance Due</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow key={row.agreementId}>
                    <TableCell>{row.businessName}</TableCell>
                    <TableCell>{row.place}</TableCell>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>Rs {Number(row.monthlyRent).toLocaleString()}</TableCell>
                    <TableCell>Rs {Number(row.paidAmount).toLocaleString()}</TableCell>
                    <TableCell>Rs {Number(row.balanceDue).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={statusColor[row.status] || "default"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider />

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
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
