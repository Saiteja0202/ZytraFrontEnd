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
  Chip,
  Stack,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const UserOrders = () => {
  const navigate = useNavigate();
  // 🔒 ALL YOUR STATE & LOGIC — UNCHANGED
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

        setError("Failed to load orders.",err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      window.location.reload();
    } catch {
      alert("Payment failed.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const date = new Date(order.orderDate);
    return (
      (!selectedYear || date.getFullYear().toString() === selectedYear) &&
      (!selectedMonth || (date.getMonth() + 1).toString() === selectedMonth)
    );
  });

  if (loading)
    return (
      <Box mt={6} textAlign="center">
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      {/* Filters */}
<Stack
  direction="row"
  alignItems="center"
  spacing={1}
  sx={{
    cursor: "pointer",
    color: "primary.main",
    mb:3,
    transition: "all 0.3s ease",
    "&:hover": {
      color: "secondary.main",
      transform: "scale(1.05)",
    },
  }}
  onClick={() => navigate("/user-dashboard")}
>
  <HomeIcon fontSize="medium" />
  <Typography variant="h6" fontWeight="bold">
    Home
  </Typography>
</Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {[...new Set(orders.map(o => new Date(o.orderDate).getFullYear()))].map(y => (
                <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button onClick={() => { setSelectedYear(""); setSelectedMonth(""); }}>
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* Orders */}
      {filteredOrders.map(order => (
        <Paper key={order.orderId} sx={{ mb: 4, p: 3 }}>
          <Typography fontWeight={600}>
            Order placed on {new Date(order.orderDate).toDateString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {order.groupsByPaymentType.map((paymentGroup, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography color="primary">
                Payment Method: {paymentGroup.paymentType}
              </Typography>

              {paymentGroup.groupsByPaymentStatus.map((statusGroup, sIdx) => (
                <Box key={sIdx}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={statusGroup.paymentStatus}
                      color={statusGroup.paymentStatus === "PENDING" ? "warning" : "success"}
                      size="small"
                    />
                    <Typography fontWeight={600}>
                      ₹{statusGroup.totalPrice.toLocaleString()}
                    </Typography>
                  </Stack>

                  {statusGroup.paymentStatus === "PENDING" &&
                    paymentGroup.paymentType === "PAYONDELIVERY" && (
                      <Button
                        startIcon={<PaymentsIcon />}
                        variant="contained"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleOpenPayDialog(order.orderId)}
                      >
                        Pay Now
                      </Button>
                    )}

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {statusGroup.orderItems.map(item => (
                      <Grid item xs={12} sm={6} md={4} key={item.orderItem}>
                        <Card sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2}>
                            <Avatar
                              variant="square"
                              src={item.image}
                              sx={{ width: 90, height: 90 }}
                            />
                            <Box>
                              <Typography fontWeight={600}>{item.productName}</Typography>
                              <Typography variant="body2">Qty: {item.productQuantity}</Typography>
                              <Typography variant="body2">
                                ₹{(item.totalPrice * item.productQuantity).toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="error">
                                {item.shippingStatus}
                              </Typography>
                            </Box>
                          </Stack>
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

      {/* Payment Dialog */}
      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)}>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select value={selectedPaymentType} onChange={(e) => setSelectedPaymentType(e.target.value)}>
              <MenuItem value="CARD">Card</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="CASH">Cash</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmPayment}>Pay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserOrders;
