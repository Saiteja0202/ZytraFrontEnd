import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  addSeller,
  getAllSellers,
  activateSeller,
  deactivateSeller,
  updateSeller,
} from "../API/AdminAPIs";

const AdminSeller = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [newSeller, setNewSeller] = useState({
    sellerName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [editSeller, setEditSeller] = useState({
    sellerId: null,
    sellerName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!adminId) {
      setTimeout(() => {
        setError("Admin ID not found in session.");
        setLoading(false);
      }, 0);
      return;
    }

    getAllSellers(adminId)
      .then((res) => setSellers(res.data))
      .catch(() => setError("Failed to fetch sellers"))
      .finally(() => setLoading(false));
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSeller((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSeller((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSeller = async () => {
    const { sellerName, email, phoneNumber, address } = newSeller;
    if (!sellerName || !email || !phoneNumber || !address) {
      setSnackbar({ open: true, message: "All fields are required", severity: "warning" });
      return;
    }

    try {
      const res = await addSeller(adminId, newSeller);
      setSellers((prev) => [...prev, res.data]);
      setSnackbar({ open: true, message: "Seller added successfully", severity: "success" });
      setNewSeller({ sellerName: "", email: "", phoneNumber: "", address: "" });
      setOpenAdd(false);
    } catch {
      setSnackbar({ open: true, message: "Failed to add seller", severity: "error" });
    }
  };

  const handleActivateDeactivate = async (sellerId, currentStatus) => {
    try {
      if (currentStatus === "ACTIVE") {
        await deactivateSeller(adminId, sellerId);
        setSellers((prev) =>
          prev.map((s) =>
            s.sellerId === sellerId ? { ...s, sellerStatus: "INACTIVE" } : s
          )
        );
        setSnackbar({ open: true, message: "Seller deactivated", severity: "success" });
      } else {
        await activateSeller(adminId, sellerId);
        setSellers((prev) =>
          prev.map((s) =>
            s.sellerId === sellerId ? { ...s, sellerStatus: "ACTIVE" } : s
          )
        );
        setSnackbar({ open: true, message: "Seller activated", severity: "success" });
      }
    } catch {
      setSnackbar({ open: true, message: "Action failed", severity: "error" });
    }
  };

  const handleEditOpen = (seller) => {
    setEditSeller(seller);
    setOpenEdit(true);
  };

  const handleUpdateSeller = async () => {
    const { sellerId, sellerName, email, phoneNumber, address } = editSeller;
    if (!sellerName || !email || !phoneNumber || !address) {
      setSnackbar({ open: true, message: "All fields are required", severity: "warning" });
      return;
    }

    try {
      await updateSeller(adminId, sellerId, { sellerName, email, phoneNumber, address });
      setSellers((prev) =>
        prev.map((s) => (s.sellerId === sellerId ? editSeller : s))
      );
      setSnackbar({ open: true, message: "Seller updated successfully", severity: "success" });
      setOpenEdit(false);
    } catch {
      setSnackbar({ open: true, message: "Failed to update seller", severity: "error" });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 10 }}>
        {error}
      </Typography>
    );

  const containedButtonStyle = {
    bgcolor: "#512DA8",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { bgcolor: "#512DA8", boxShadow: "0 0 8px 2px white" },
  };

  const outlinedButtonStyle = {
    borderColor: "white",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { backgroundColor: "#1f2937", borderColor: "#512DA8", boxShadow: "0 0 8px 2px white" },
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box
        sx={{
          bgcolor: "#1f2937",
          color: "#f3f4f6",
          p: 5,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "700" }}>
            Manage Sellers
          </Typography>
          <Button variant="contained" sx={containedButtonStyle} onClick={() => setOpenAdd(true)}>
            Add Seller
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#374151", mb: 4 }} />

        <Grid container spacing={3}>
          {sellers.length === 0 && (
            <Typography color="#d1d5db" sx={{ mt: 2 }}>
              No sellers found.
            </Typography>
          )}
          {sellers.map((seller) => (
            <Grid key={seller.sellerId} item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#374151",
                  borderRadius: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ color: "#e0e7ff", mb: 1, fontWeight: 600 }}>
                  {seller.sellerName}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>Email: {seller.email}</Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>Phone: {seller.phoneNumber}</Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14, mb: 1 }}>Address: {seller.address}</Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      ...(seller.sellerStatus === "ACTIVE" ? { bgcolor: "red" } : containedButtonStyle),
                    }}
                    onClick={() => handleActivateDeactivate(seller.sellerId, seller.sellerStatus)}
                  >
                    {seller.sellerStatus === "ACTIVE" ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={outlinedButtonStyle}
                    onClick={() => handleEditOpen(seller)}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ADD SELLER DIALOG */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Add New Seller</DialogTitle>
        <DialogContent dividers>
          {["sellerName", "email", "phoneNumber", "address"].map((field) => (
            <TextField
              key={field}
              margin="normal"
              label={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              name={field}
              value={newSeller[field]}
              onChange={handleChange}
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: "#e0e7ff" } }}
              InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenAdd(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddSeller} sx={containedButtonStyle}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT SELLER DIALOG */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Edit Seller</DialogTitle>
        <DialogContent dividers>
          {["sellerName", "email", "phoneNumber", "address"].map((field) => (
            <TextField
              key={field}
              margin="normal"
              label={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              name={field}
              value={editSeller[field]}
              onChange={handleEditChange}
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: "#e0e7ff" } }}
              InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenEdit(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateSeller} sx={containedButtonStyle}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSeller;
