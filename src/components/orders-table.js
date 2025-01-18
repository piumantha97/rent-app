import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./scrollbar";

const statusVariants = [
  {
    label: "Placed",
    value: "placed",
  },
  {
    label: "Processed",
    value: "processed",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Complete",
    value: "complete",
  },
];

export const OrdersTable = (props) => {
  // const { orders } = props;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/property");
        setOrders(response.data); // Assuming the API response returns an array of orders
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>Place</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {orders.map((order) => {
              const statusVariant = statusVariants.find(
                (variant) => variant.value === order.status
              );

              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      to="#"
                      underline="none"
                      variant="subtitle2"
                    >
                      {`#${order.id}`}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography color="inherit" variant="inherit">
                        {format(new Date(order.createdAt), "dd MMM yyyy")}
                      </Typography>
                      <Typography color="textSecondary" variant="inherit">
                        {format(new Date(order.createdAt), "HH:mm")}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {`${order.customer.firstName} ${order.customer.lastName}`}
                  </TableCell>
                  <TableCell>
                    <Chip label={statusVariant.label} variant="outlined" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody> */}

                 {/* <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.placeCode}</TableCell>
                <TableCell>
                  {format(new Date(order.endDate), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>{order.fullName}</TableCell>
                <TableCell>
                  {format(new Date(order.startDate), 'dd MMM yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */}

<TableBody>
    {orders.map((order) => (
      <TableRow key={order._id}>
        {/* Place */}
        <TableCell>
          <Link
            color="inherit"
            component={RouterLink}
            to="#"
            underline="none"
            variant="subtitle2"
          >
            <Typography variant="subtitle2" color="textPrimary">
              {order.placeCode}
            </Typography>
          </Link>
        </TableCell>

        {/* End Date */}
        <TableCell>
          <Box>
            <Typography color="textPrimary" variant="body1">
              {format(new Date(order.endDate), 'dd MMM yyyy')}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {format(new Date(order.endDate), 'HH:mm')}
            </Typography>
          </Box>
        </TableCell>

        {/* Name */}
        <TableCell>
          <Typography variant="body1" color="textPrimary">
            {order.fullName}
          </Typography>
        </TableCell>

        {/* Start Date */}
        <TableCell>
          <Box>
            <Typography color="textPrimary" variant="body1">
              {format(new Date(order.startDate), 'dd MMM yyyy')}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {format(new Date(order.startDate), 'HH:mm')}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
        </Table>
      </Scrollbar>
    </div>
  );
};

OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
};
