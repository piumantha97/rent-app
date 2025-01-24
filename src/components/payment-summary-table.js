import dayjs from "dayjs";

export const PaymentSummaryTable = ({ records }) => (
    <table>
      <thead>
        <tr>
          <th>Business Name</th>
          <th>Payment Status</th>
          <th>Payment Date</th>
          <th>Remarks</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record._id}>
            <td>{record.businessId?.businessName}</td>
            <td>{record.isPaid ? "Paid" : "Pending"}</td>
            <td>{dayjs(record.paymentDate).format("YYYY-MM-DD")}</td>
            <td>{record.remarks || "N/A"}</td>
            <td>{record.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  