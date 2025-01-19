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
} from "@mui/material";
import axios from "axios";
import { AgreementsTable } from "../components/agreements-table";

export const Agreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [sortedAgreements, setSortedAgreements] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  // Fetch agreements on mount
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/agreements");
        const data = response.data;

        // Sort by recent endDate
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.endDate);
          const dateB = new Date(b.endDate);
          return dateB - dateA;
        });

        setAgreements(data);
        setSortedAgreements(sorted);
      } catch (error) {
        console.error("Error fetching agreements:", error);
      }
    };

    fetchAgreements();
  }, []);

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    // Filter agreements by business name
    const filtered = agreements.filter((agreement) =>
      agreement.businessId?.businessName
        .toLowerCase()
        .includes(newQuery.toLowerCase())
    );
    setSortedAgreements(filtered);
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
        <title>Agreements | Dashboard</title>
      </Helmet>
      <Box sx={{ backgroundColor: "background.default", pb: 3, pt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ alignItems: "center", display: "flex", mb: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Business Agreements
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button color="primary" size="large" variant="contained">
              Add Agreement
            </Button>
          </Box>
          <Card variant="outlined">
            <Box sx={{ display: "flex", p: 2 }}>
              <TextField
                fullWidth
                label="Search by Business Name"
                value={query}
                onChange={handleQueryChange}
                variant="outlined"
              />
            </Box>
            <Divider />
            <AgreementsTable
              agreements={sortedAgreements.slice(
                page * rowsPerPage,
                (page + 1) * rowsPerPage
              )}
            />
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sortedAgreements.length}
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
