import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./scrollbar";

export const AgreementsTable = ({ agreements = [] }) => {
  if (!agreements || agreements.length === 0) {
    return <Typography variant="h6">No agreements available</Typography>;
  }

  return (
    <Scrollbar>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Place</TableCell>
            <TableCell>Agreement Type</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Monthly Rent</TableCell>
            <TableCell>Key Money</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agreements.map((agreement) => (
            <TableRow key={agreement._id}>
              {/* Business Name */}
              <TableCell>
                {agreement.businessId?.businessName || "N/A"}
              </TableCell>

              {/* Place */}
              <TableCell>
                {agreement.businessId?.assignedPlace
                  ? `${agreement.businessId.assignedPlace.building} - Floor ${agreement.businessId.assignedPlace.floor}`
                  : "N/A"}
              </TableCell>

              {/* Agreement Type */}
              <TableCell>{agreement.agreementType || "N/A"}</TableCell>

              {/* Start Date */}
              <TableCell>
                {agreement.startDate
                  ? format(new Date(agreement.startDate), "dd MMM yyyy")
                  : "N/A"}
              </TableCell>

              {/* End Date */}
              <TableCell>
                {agreement.endDate
                  ? format(new Date(agreement.endDate), "dd MMM yyyy")
                  : "N/A"}
              </TableCell>

              {/* Monthly Rent */}
              <TableCell>
                {agreement.monthlyRent
                  ? `Rs ${agreement.monthlyRent.toLocaleString()}`
                  : "N/A"}
              </TableCell>

              {/* Key Money */}
              <TableCell>
                {agreement.keyMoney
                  ? `Rs ${agreement.keyMoney.toLocaleString()}`
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );
};

AgreementsTable.propTypes = {
  agreements: PropTypes.array,
};
