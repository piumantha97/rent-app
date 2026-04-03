import { useEffect, useMemo, useState } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AgreementsTable } from "../components/agreements-table";

const getAgreementStatus = (endDate) => {
  const today = new Date();
  const expiry = new Date(endDate);

  const diffTime = expiry.setHours(0, 0, 0, 0) - new Date(today.setHours(0, 0, 0, 0));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 30) return "expiring";
  return "active";
};

export const Agreements = () => {
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // active | expiring | expired | all
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgreements = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/agreements`
        );

        const dataWithStatus = (response.data || []).map((agreement) => ({
          ...agreement,
          agreementStatus: getAgreementStatus(agreement.endDate),
        }));

        // nearest ending first
        const sortedData = [...dataWithStatus].sort(
          (a, b) => new Date(a.endDate) - new Date(b.endDate)
        );

        setAgreements(sortedData);
      } catch (error) {
        console.error("Error fetching agreements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, []);

  const filteredAgreements = useMemo(() => {
    const search = query.trim().toLowerCase();

    return agreements.filter((agreement) => {
      const businessName =
        agreement.businessDetails?.businessName?.toLowerCase() || "";

      const personName =
        agreement.businessDetails?.personName?.toLowerCase() || "";

      const building =
        agreement.placeDetails?.building?.toLowerCase() || "";

      const floor =
        String(agreement.placeDetails?.floor || "").toLowerCase();

      const partition =
        agreement.placeDetails?.partition?.toLowerCase() || "";

      const unitCode =
        agreement.placeDetails?.unitCode?.toLowerCase() || "";

      const agreementType =
        agreement.agreementType?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        businessName.includes(search) ||
        personName.includes(search) ||
        building.includes(search) ||
        floor.includes(search) ||
        partition.includes(search) ||
        unitCode.includes(search) ||
        agreementType.includes(search);

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = agreement.agreementStatus === "active";
      } else if (statusFilter === "expiring") {
        matchesStatus = agreement.agreementStatus === "expiring";
      } else if (statusFilter === "expired") {
        matchesStatus = agreement.agreementStatus === "expired";
      } else if (statusFilter === "all") {
        matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });
  }, [agreements, query, statusFilter]);

  const paginatedAgreements = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredAgreements.slice(start, end);
  }, [filteredAgreements, page, rowsPerPage]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddAgreement = () => {
    navigate("/dashboard/add-agreement");
  };

  return (
    <>
      <Helmet>
        <title>Agreements | Dashboard</title>
      </Helmet>

      <Box sx={{ backgroundColor: "background.default", pb: 3, pt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ alignItems: "center", display: "flex", mb: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Business Agreements
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={handleAddAgreement}
            >
              Add Agreement
            </Button>
          </Box>

          <Card variant="outlined">
            <Box sx={{ display: "flex", p: 2, gap: 2 }}>
              <TextField
                fullWidth
                label="Search Agreements"
                value={query}
                onChange={handleQueryChange}
                variant="outlined"
                placeholder="Search by business, person, building, floor, partition, or unit code"
              />

              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={handleStatusChange}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expiring">Ending Soon</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </TextField>
            </Box>

            <Divider />

            {loading ? (
              <Box sx={{ p: 3 }}>
                <Typography>Loading agreements...</Typography>
              </Box>
            ) : (
              <AgreementsTable agreements={paginatedAgreements} />
            )}

            <Divider />

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAgreements.length}
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