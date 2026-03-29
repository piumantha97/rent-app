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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AgreementsTable } from "../components/agreements-table";

export const Agreements = () => {
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgreements = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/agreements`
        );

        const sortedData = [...response.data].sort(
          (a, b) => new Date(b.endDate) - new Date(a.endDate)
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

    if (!search) return agreements;

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

      const agreementType =
        agreement.agreementType?.toLowerCase() || "";

      return (
        businessName.includes(search) ||
        personName.includes(search) ||
        building.includes(search) ||
        floor.includes(search) ||
        partition.includes(search) ||
        agreementType.includes(search)
      );
    });
  }, [agreements, query]);

  const paginatedAgreements = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredAgreements.slice(start, end);
  }, [filteredAgreements, page, rowsPerPage]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
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
    navigate("/agreements/add");
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
            <Box sx={{ display: "flex", p: 2 }}>
              <TextField
                fullWidth
                label="Search Agreements"
                value={query}
                onChange={handleQueryChange}
                variant="outlined"
                placeholder="Search by business, person, building, floor, or partition"
              />
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