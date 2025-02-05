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
  const [agreements, setAgreements] = useState([]); // Holds all agreements
  const [filteredAgreements, setFilteredAgreements] = useState([]); // Holds filtered agreements based on search query
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  // Fetch agreements on mount
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/agreements`);
        const data = response.data;

        // Sort agreements by recent `endDate`
        // const sorted = data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

        setAgreements(data);
        setFilteredAgreements(data); // Initially, display all agreements
      } catch (error) {
        console.error("Error fetching agreements:", error);
      }
    };

    fetchAgreements();
  }, []);

  // Handle search functionality
  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    // Filter agreements by `businessName`, case-insensitive
    const filtered = agreements.filter((agreement) =>
      agreement.businessDetails?.businessName
        ?.toLowerCase()
        .includes(newQuery.toLowerCase())
    );

    setFilteredAgreements(filtered);
    setPage(0); // Reset pagination when search changes
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
                placeholder="Type a business name..."
              />
            </Box>
            <Divider />
            <AgreementsTable
              agreements={filteredAgreements.slice(
                page * rowsPerPage,
                (page + 1) * rowsPerPage
              )}
            />
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
