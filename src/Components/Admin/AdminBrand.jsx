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
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  addBrand,
  getAllBrands,
  updateBrand,
} from "../API/AdminAPIs";

const AdminBrand = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [page, setPage] = useState(1);



  const filteredBrands = selectedBrandId
  ? brands.filter((brand) => brand.brandId === selectedBrandId)
  : brands;

  const brandsPerPage = 5;

  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);
  
  const paginatedBrands = filteredBrands.slice(
    (page - 1) * brandsPerPage,
    page * brandsPerPage
  );
  
    
  const [newBrand, setNewBrand] = useState({
    brandName: "",
    brandDescription: "",
    brandImage:"",
  });

  const [editBrand, setEditBrand] = useState({
    brandId: null,
    brandName: "",
    brandDescription: "",
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

    getAllBrands(adminId)
      .then((res) => setBrands(res.data))
      .catch(() => setError("Failed to fetch brands"))
      .finally(() => setLoading(false));
  }, [adminId]);

  const handleChange = (e) => {
    setNewBrand((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditBrand((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddBrand = async () => {
    const { brandName, brandDescription } = newBrand;
    if (!brandName || !brandDescription) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
      return;
    }

    try {
      await addBrand(adminId, newBrand);
      setSnackbar({
        open: true,
        message: "Brand added successfully",
        severity: "success",
      });

      setBrands((prev) => [
        ...prev,
        { ...newBrand, brandId: prev.length + 1 },
      ]);

      setNewBrand({ brandName: "", brandDescription: "" });
      setOpenAdd(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add brand",
        severity: "error",
      });
    }
  };

  const handleEditOpen = (brand) => {
    setEditBrand(brand);
    setOpenEdit(true);
  };

  const handleUpdateBrand = async () => {
    try {
      await updateBrand(adminId, editBrand.brandId, {
        brandName: editBrand.brandName,
        brandDescription: editBrand.brandDescription,
        brandImage:editBrand.brandImage,
      });

      setBrands((prev) =>
        prev.map((brand) =>
          brand.brandId === editBrand.brandId ? editBrand : brand
        )
      );

      setSnackbar({
        open: true,
        message: "Brand updated successfully",
        severity: "success",
      });

      setOpenEdit(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update brand",
        severity: "error",
      });
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
    "&:hover": {
      bgcolor: "#512DA8",
      boxShadow: "0 0 8px 2px white",
    },
  };

  const outlinedButtonStyle = {
    borderColor: "white",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#1f2937",
      borderColor: "#512DA8",
      boxShadow: "0 0 8px 2px white",
    },
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
            Manage Brands
          </Typography>
          <Button
            variant="contained"
            sx={containedButtonStyle}
            onClick={() => setOpenAdd(true)}
          >
            Add Brand
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#374151", mb: 4 }} />

        <FormControl
  fullWidth
  variant="filled"
  sx={{ mb: 3 }}
>
  <InputLabel sx={{ color: "#e0e7ff" }}>
    Select Brand
  </InputLabel>

  <Select
    value={selectedBrandId}
    onChange={(e) => {
      setSelectedBrandId(e.target.value);
      setPage(1); // reset pagination
    }}
    sx={{
      backgroundColor: "#374151",
      color: "#d1d5db",
      borderRadius: 1,
    }}
  >
    <MenuItem value="">
      <em>All Brands</em>
    </MenuItem>

    {brands.map((brand) => (
      <MenuItem key={brand.brandId} value={brand.brandId}>
        {brand.brandName}
      </MenuItem>
    ))}
  </Select>
</FormControl>


        <Grid container spacing={3}>
          {brands.length === 0 && (
            <Typography color="#d1d5db" sx={{ mt: 2 }}>
              No brands found.
            </Typography>
          )}

          {paginatedBrands.map((brand) => (
            <Grid key={brand.brandId} item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#374151",
                  borderRadius: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#e0e7ff",
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  {brand.brandName.toUpperCase()}
                </Typography>

                <Typography
                  sx={{ color: "#d1d5db", fontSize: 14 }}
                >
                  {brand.brandDescription}
                </Typography>
                {brand.brandImage && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={brand.brandImage}
                      alt={brand.brandName}
                      style={{ width:"150px",height:"100px", borderRadius: 8 }}
                    />
                  </Box>
                )}

                <Button
                  size="small"
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => handleEditOpen(brand)}
                >
                  Edit
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
        {totalPages > 1 && (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
    <Pagination
      count={totalPages}
      page={page}
      onChange={(e, value) => setPage(value)}
      color="primary"
      sx={{
        "& .MuiPaginationItem-root": {
          color: "white",         
        },
        "& .MuiPaginationItem-icon": {
          color: "white",        
        }
      }}
    />
  </Box>
)}

      </Box>

      {/* ADD BRAND */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Add New Brand</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Brand Name"
            name="brandName"
            value={newBrand.brandName}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{
              style: {
                color: "#d1d5db",
                backgroundColor: "#374151",
                borderRadius: 4,
              },
            }}
          />

          <TextField
            margin="normal"
            label="Brand Description"
            name="brandDescription"
            value={newBrand.brandDescription}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{
              style: {
                color: "#d1d5db",
                backgroundColor: "#374151",
                borderRadius: 4,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenAdd(false)}
            sx={outlinedButtonStyle}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddBrand}
            sx={containedButtonStyle}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT BRAND */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Edit Brand</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Brand Name"
            name="brandName"
            value={editBrand.brandName}
            onChange={handleEditChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{
              style: {
                color: "#d1d5db",
                backgroundColor: "#374151",
                borderRadius: 4,
              },
            }}
          />

          <TextField
            margin="normal"
            label="Brand Description"
            name="brandDescription"
            value={editBrand.brandDescription}
            onChange={handleEditChange}
            fullWidth
            multiline
            minRows={3}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{
              style: {
                color: "#d1d5db",
                backgroundColor: "#374151",
                borderRadius: 4,
              },
            }}
          />

<TextField
            margin="normal"
            label="Brand Image URL"
            name="brandImage"
            value={editBrand.brandImage}
            onChange={handleEditChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{
              style: {
                color: "#d1d5db",
                backgroundColor: "#374151",
                borderRadius: 4,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenEdit(false)}
            sx={outlinedButtonStyle}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateBrand}
            sx={containedButtonStyle}
          >
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
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminBrand;
