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
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { addDiscount, getAllDiscounts, updateDiscount } from "../API/AdminAPIs";

const discountTypes = ["AMOUNT", "PERCENTAGE", "FLAT", "ACTUAL"];

const AdminDiscount = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const formatDateForBackend = (date) => {
    if (!date) return null; 
    return `${date}T00:00:00`; 
  };

  const [newDiscount, setNewDiscount] = useState({
    discountType: "",
    discountValue: 0,
    startDate: "",
    endDate: "",
  });

  const [editDiscount, setEditDiscount] = useState({
    discountId: null,
    discountType: "",
    discountValue: 0,
    startDate: "",
    endDate: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!adminId) {
      setTimeout(() => {
        setError("Admin ID not found in session.");
        setLoading(false);
      }, 0);
      return;
    }

    getAllDiscounts(adminId)
      .then((res) => setDiscounts(res.data))
      .catch(() => setError("Failed to fetch discounts"))
      .finally(() => setLoading(false));
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDiscount((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDiscount((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDiscount = async () => {
    if (!newDiscount.discountType) {
      setSnackbar({ open: true, message: "Discount type is required", severity: "warning" });
      return;
    }
  
    try {
      const payload = {
        ...newDiscount,
        startDate: formatDateForBackend(newDiscount.startDate),
        endDate: formatDateForBackend(newDiscount.endDate),
      };
  
      await addDiscount(adminId, payload);
      setSnackbar({ open: true, message: "Discount added successfully", severity: "success" });
      setDiscounts((prev) => [
        ...prev,
        { ...payload, discountId: prev.length + 1 },
      ]);
      setNewDiscount({ discountType: "", discountValue: 0, startDate: "", endDate: "" });
      setOpenAdd(false);
    } catch {
      setSnackbar({ open: true, message: "Failed to add discount", severity: "error" });
    }
  };

  const handleEditOpen = (discount) => {
    setEditDiscount(discount);
    setOpenEdit(true);
  };

  const handleUpdateDiscount = async () => {
    try {
      await updateDiscount(adminId, editDiscount.discountId, {
        discountType: editDiscount.discountType,
        discountValue: editDiscount.discountValue,
        startDate: formatDateForBackend(editDiscount.startDate),
        endDate: formatDateForBackend(editDiscount.endDate),
      });

      setDiscounts((prev) =>
        prev.map((d) => (d.discountId === editDiscount.discountId ? editDiscount : d))
      );

      setSnackbar({ open: true, message: "Discount updated successfully", severity: "success" });
      setOpenEdit(false);
    } catch {
      setSnackbar({ open: true, message: "Failed to update discount", severity: "error" });
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
            Manage Discounts
          </Typography>
          <Button variant="contained" sx={containedButtonStyle} onClick={() => setOpenAdd(true)}>
            Add Discount
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#374151", mb: 4 }} />

        <Grid container spacing={3}>
          {discounts.length === 0 && (
            <Typography color="#d1d5db" sx={{ mt: 2 }}>
              No discounts found.
            </Typography>
          )}
          {discounts.map((discount) => (
            <Grid key={discount.discountId} item xs={12} sm={6}>
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
                  {discount.discountType} - {discount.discountValue}
                  {discount.discountType === "PERCENTAGE" ? "%" : ""}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  {discount.startDate ? `Start: ${new Date(discount.startDate).toLocaleDateString()}` : "Start: -"}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  {discount.endDate ? `End: ${new Date(discount.endDate).toLocaleDateString()}` : "End: -"}
                </Typography>
                <Button size="small" sx={{ mt: 2 }} variant="contained" onClick={() => handleEditOpen(discount)}>
                  Edit
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ADD DISCOUNT */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Add New Discount</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            margin="normal"
            label="Discount Type"
            name="discountType"
            value={newDiscount.discountType}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          >
            {discountTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            label="Discount Value"
            name="discountValue"
            type="number"
            value={newDiscount.discountValue}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          />

          <TextField
            margin="normal"
            label="Start Date"
            name="startDate"
            type="date"
            value={newDiscount.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#e0e7ff" }, shrink: true }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          />

          <TextField
            margin="normal"
            label="End Date"
            name="endDate"
            type="date"
            value={newDiscount.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: "#e0e7ff" }, shrink: true }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenAdd(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddDiscount} sx={containedButtonStyle}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DISCOUNT */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Edit Discount</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            margin="normal"
            label="Discount Type"
            name="discountType"
            value={editDiscount.discountType}
            onChange={handleEditChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          >
            {discountTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            label="Discount Value"
            name="discountValue"
            type="number"
            value={editDiscount.discountValue}
            onChange={handleEditChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          />

          <TextField
            margin="normal"
            label="Start Date"
            name="startDate"
            type="date"
            value={editDiscount.startDate}
            onChange={handleEditChange}
            fullWidth
            InputLabelProps={{ style: { color: "#e0e7ff" }, shrink: true }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          />

          <TextField
            margin="normal"
            label="End Date"
            name="endDate"
            type="date"
            value={editDiscount.endDate}
            onChange={handleEditChange}
            fullWidth
            InputLabelProps={{ style: { color: "#e0e7ff" }, shrink: true }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151", borderRadius: 4 } }}
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenEdit(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateDiscount} sx={containedButtonStyle}>
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

export default AdminDiscount;
