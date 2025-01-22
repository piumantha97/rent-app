import { format } from "date-fns";
import PropTypes from "prop-types";
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

export const RecordsTable = ({ records }) => {
  if (records.length === 0) {
    return <Typography variant="h6">No records available</Typography>;
  }

  return (
    <Scrollbar>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Place</TableCell>
            <TableCell>Payment Month</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Remarks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {records.map((record) => (
    <TableRow key={record._id}>
      <TableCell>{record.businessDetails?.businessName || 'N/A'}</TableCell>
      <TableCell>
        {record.place}
      </TableCell>
      <TableCell>{record.month || 'N/A'}</TableCell>
      <TableCell>
        {record.paymentDate ? format(new Date(record.paymentDate), 'dd MMM yyyy') : 'N/A'}
      </TableCell>
      <TableCell>{`$${record.paymentAmount.toFixed(2)}`}</TableCell>
      <TableCell>{record.paymentMethod || 'N/A'}</TableCell>
      <TableCell>{record.remarks || 'N/A'}</TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </Scrollbar>
  );
};

RecordsTable.propTypes = {
  records: PropTypes.array.isRequired,
};
