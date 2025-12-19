import React, { useEffect, useState } from "react";
import { getOrdersDetails, orderPayment } from "../API/UserAPIs";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");

        if (!userId || !token) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const response = await getOrdersDetails(userId);
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ===================== PAY DIALOG ===================== */

  const handleOpenPayDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setSelectedPaymentType("");
    setPayDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentType) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const userId = sessionStorage.getItem("userId");

      await orderPayment(userId, selectedOrderId, {
        paymentType: selectedPaymentType,
      });

      alert("Payment successful!");
      setPayDialogOpen(false);

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    }
  };

  /* ===================== FILTERING ===================== */

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    const matchesYear = selectedYear
      ? orderDate.getFullYear().toString() === selectedYear
      : true;
    const matchesMonth = selectedMonth
      ? (orderDate.getMonth() + 1).toString() === selectedMonth
      : true;
    return matchesYear && matchesMonth;
  });

  const years = [
    ...new Set(orders.map((o) => new Date(o.orderDate).getFullYear())),
  ];

  /* ===================== UI ===================== */

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;
  if (orders.length === 0) return <Typography>No orders found.</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <MenuItem key={month} value={month.toString()}>
                {new Date(0, month - 1).toLocaleString("default", {
                  month: "long",
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() => {
            setSelectedYear("");
            setSelectedMonth("");
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Orders */}
      {filteredOrders.map((order) => (
        <Paper key={order.orderId} sx={{ mb: 4, p: 3 }}>
          <Typography variant="h6">Ordered On: {order.orderDate}</Typography>
          <Divider sx={{ my: 2 }} />

          {order.groupsByPaymentType.map((paymentGroup, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                Payment Type: {paymentGroup.paymentType}
              </Typography>

              {paymentGroup.groupsByPaymentStatus.map((statusGroup, sIdx) => (
                <Box key={sIdx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Payment Status: {statusGroup.paymentStatus}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Total:{" "}
                    <b>₹{statusGroup.totalPrice.toLocaleString()}</b>
                  </Typography>

                  {statusGroup.paymentStatus === "PENDING" &&
                    paymentGroup.paymentType === "PAYONDELIVERY" && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mb: 2 }}
                        onClick={() => handleOpenPayDialog(order.orderId)}
                      >
                        Pay Now
                      </Button>
                    )}

                  <Grid container spacing={2}>
                    {statusGroup.orderItems.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.orderItem}>
                        <Card sx={{ display: "flex", p: 2 }}>
                          <Avatar
                            variant="square"
                            src={item.image}
                            sx={{ width: 100, height: 100, mr: 2 }}
                          />
                          <CardContent sx={{ p: 0 }}>
                            <Typography fontWeight={600}>
                              {item.productName}
                            </Typography>
                            <Typography variant="body2">
                              Qty: {item.productQuantity}
                            </Typography>
                            <Typography variant="body2">
                              ₹
                              {(
                                item.totalPrice * item.productQuantity
                              ).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="error">
                              {item.shippingStatus}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          ))}
        </Paper>
      ))}

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)}>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={selectedPaymentType}
              label="Payment Method"
              onChange={(e) => setSelectedPaymentType(e.target.value)}
            >
              <MenuItem value="CARD">Card</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="CASH">Cash</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmPayment}>
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserOrders;
