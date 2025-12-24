import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CardMedia,
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Pagination,
 
} from "@mui/material";
import {
  getCart,
  addToCart,
  deleteFromCart,
  initiateOrder,
  orderPayment,
} from "../API/UserAPIs";
import { useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";


const UserCart = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2 rows * 3 columns

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getCart(userId);
      setCart(res.data?.carts || []);
      console.log("carts : ",res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;
    loadCart();
  }, [userId, token]);

  const handleAdd = async (productId) => {
    try {
      await addToCart(userId, productId);
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, productQuantity: item.productQuantity + 1 }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const item = cart.find((c) => c.productId === productId);
      if (!item) return;

      if (item.productQuantity === 1) {
        await deleteFromCart(userId, productId);
        setCart((prev) => prev.filter((c) => c.productId !== productId));
      } else {
        await deleteFromCart(userId, productId);
        setCart((prev) =>
          prev.map((c) =>
            c.productId === productId
              ? { ...c, productQuantity: c.productQuantity - 1 }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await initiateOrder(userId);
      const newOrderId = parseInt(res.data.split(":")[1], 10);
      sessionStorage.setItem("orderId", newOrderId);
      setOrderDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    if (!paymentType) return alert("Please select a payment method.");
    try {
      const orderId = parseInt(sessionStorage.getItem("orderId"), 10);
      await orderPayment(userId, orderId, { paymentType });
      alert("Payment successful!");
      setOrderDialogOpen(false);
      loadCart();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cart.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cart.length / itemsPerPage);

  const totalPrice = (cart || []).reduce(
    (sum, item) => sum + item.totalPrice * item.productQuantity,
    0
  );

  if (loading)
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>Loading cart...</Typography>
    );

  if (!cart || cart.length === 0)
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>Your cart is empty</Typography>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>

<Stack
  direction="row"
  alignItems="center"
  spacing={1}
  sx={{
    cursor: "pointer",
    color: "primary.main",
    transition: "all 0.3s ease",
    mb:3,
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


      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        {currentItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.cartId}>
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.productName}
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "contain",
                  borderRadius: 1,
                  mb: 1,
                }}
              />

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {item.productName}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Brand: {item.brandName} | Seller: {item.sellerName}
                </Typography>

                {item.productDescription && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.productDescription.length > 100
                      ? `${item.productDescription.substring(0, 45)}...`
                      : item.productDescription}
                  </Typography>
                )}

                {item.discountValue && item.discountValue > 0 ? (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through", mr: 1 }}
                    >
                      ₹{item.actualPrice * item.productQuantity}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "primary.main", fontWeight: "bold" }}
                    >
                      ₹{(
                        (item.totalPrice)*
                        item.productQuantity
                      ).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "green", ml: 1, fontWeight: "bold" }}
                    >
                      {item.discountValue}% OFF
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
                  >
                    ₹{item.totalPrice * item.productQuantity}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 32 }}
                    onClick={() => handleRemove(item.productId)}
                  >
                    −
                  </Button>
                  <Typography sx={{ minWidth: 32, textAlign: "center" }}>
                    {item.productQuantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 32 }}
                    onClick={() => handleAdd(item.productId)}
                  >
                    +
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      )}

      <Divider sx={{ mt: 4, mb: 3 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Total: ₹{totalPrice}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handlePlaceOrder}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          Proceed to Buy
        </Button>
      </Box>

    {/* Payment Dialog */}
<Dialog
  open={orderDialogOpen}
  onClose={() => setOrderDialogOpen(false)}
  fullWidth
  maxWidth="xs"
>
  <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
    💳 Select Payment Method
  </DialogTitle>

  <DialogContent sx={{ mt: 1 }}>
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id="payment-select-label">Payment Type</InputLabel>
      <Select
        labelId="payment-select-label"
        value={paymentType}
        label="Payment Type"
        onChange={(e) => setPaymentType(e.target.value)}
      >
        <MenuItem value="CARD">
          <Box display="flex" alignItems="center" gap={1}>
            <CreditCardIcon color="primary" /> Credit/Debit Card
          </Box>
        </MenuItem>
        <MenuItem value="UPI">
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalanceWalletIcon color="success" /> UPI
          </Box>
        </MenuItem>
        <MenuItem value="PAYONDELIVERY">
          <Box display="flex" alignItems="center" gap={1}>
            <LocalShippingIcon color="warning" /> Pay on Delivery
          </Box>
        </MenuItem>
      </Select>
    </FormControl>

    {/* Real-time feel: show a summary */}
    <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Order Total: <strong>₹1,299</strong>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Secure payment powered by trusted gateways
      </Typography>
    </Box>
  </DialogContent>

  <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
    <Button onClick={() => setOrderDialogOpen(false)} variant="outlined">
      Cancel
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={handlePayment}
      startIcon={<ShoppingCartCheckoutIcon />}
    >
      Pay Now
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};

export default UserCart;
