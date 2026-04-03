import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const paymentMethods = ["Cash", "Bank Transfer", "Credit Card", "Other"];

export const PaymentSummary = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [editForm, setEditForm] = useState({
    paymentAmount: "",
    paymentMethod: "",
    paymentDate: "",
    month: "",
    remarks: "",
  });

  useEffect(() => {
    fetchPayments();
    fetchBusinesses();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments`
      );
      setPayments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/businesses`
      );
      setBusinesses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment record?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/${paymentId}`
      );

      setPayments((prev) =>
        prev.filter((payment) => payment._id !== paymentId)
      );
    } catch (err) {
      console.error("Failed to delete payment:", err);
      alert("Failed to delete payment record.");
    }
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setEditForm({
      paymentAmount: record.paymentAmount || "",
      paymentMethod: record.paymentMethod || "",
      paymentDate: record.paymentDate
        ? dayjs(record.paymentDate).format("YYYY-MM-DD")
        : "",
      month: record.month || "",
      remarks: record.remarks || "",
    });
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditingRecord(null);
    setEditForm({
      paymentAmount: "",
      paymentMethod: "",
      paymentDate: "",
      month: "",
      remarks: "",
    });
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePayment = async () => {
    if (!editingRecord?._id) return;

    try {
      const payload = {
        paymentAmount: Number(editForm.paymentAmount),
        paymentMethod: editForm.paymentMethod,
        paymentDate: editForm.paymentDate,
        month: editForm.month,
        remarks: editForm.remarks,
      };

      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/${editingRecord._id}`,
        payload
      );

      const updatedPayment = res.data?.payment;

      if (updatedPayment) {
        setPayments((prev) =>
          prev.map((payment) =>
            payment._id === editingRecord._id
              ? { ...payment, ...updatedPayment }
              : payment
          )
        );
      } else {
        await fetchPayments();
      }

      handleCloseEdit();
      alert("Payment updated successfully!");
    } catch (err) {
      console.error("Failed to update payment:", err);
      alert("Failed to update payment record.");
    }
  };

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
    navigate("/dashboard/monthly-rent-payments");
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

            <RecordsTable
              records={paginatedPayments}
              onDelete={handleDeletePayment}
              onEdit={handleOpenEdit}
            />

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

      <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Payment Record</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Payment Month"
            type="month"
            value={editForm.month}
            onChange={(e) => handleEditFieldChange("month", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Payment Date"
            type="date"
            value={editForm.paymentDate}
            onChange={(e) => handleEditFieldChange("paymentDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Payment Amount"
            type="number"
            value={editForm.paymentAmount}
            onChange={(e) => handleEditFieldChange("paymentAmount", e.target.value)}
            inputProps={{ min: 0, step: "any" }}
          />

          <TextField
            fullWidth
            select
            margin="normal"
            label="Payment Method"
            value={editForm.paymentMethod}
            onChange={(e) => handleEditFieldChange("paymentMethod", e.target.value)}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Remarks"
            multiline
            rows={3}
            value={editForm.remarks}
            onChange={(e) => handleEditFieldChange("remarks", e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdatePayment}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};