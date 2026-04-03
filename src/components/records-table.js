import { format } from "date-fns";
import PropTypes from "prop-types";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./scrollbar";

export const RecordsTable = ({ records, onDelete, onEdit }) => {
  if (records.length === 0) {
    return <Typography variant="h6" sx={{ p: 2 }}>No records available</Typography>;
  }

  return (
    <Scrollbar>
      <Table sx={{ minWidth: 1150 }}>
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Place</TableCell>
            <TableCell>Payment Month</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.map((record) => (
            <TableRow key={record._id} hover>
              <TableCell>
                {record.businessDetails?.businessName || "N/A"}
              </TableCell>

              <TableCell>
                {record.placeDetails?.unitCode || record.place || "N/A"}
              </TableCell>

              <TableCell>{record.month || "N/A"}</TableCell>

              <TableCell>
                {record.paymentDate
                  ? format(new Date(record.paymentDate), "dd MMM yyyy")
                  : "N/A"}
              </TableCell>

              <TableCell>
                {`Rs ${new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(record.paymentAmount || 0)}`}
              </TableCell>

              <TableCell>{record.paymentMethod || "N/A"}</TableCell>

              <TableCell>{record.remarks || "N/A"}</TableCell>

              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onEdit(record)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete(record._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );
};

RecordsTable.propTypes = {
  records: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};