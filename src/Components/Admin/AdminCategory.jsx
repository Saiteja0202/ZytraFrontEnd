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
  addCategory,
  getAllCategories,
  updateCategory,
} from "../API/AdminAPIs";

const AdminCategory = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    categoryDescription: "",
    categoryImage: "",
  });

  const [editCategory, setEditCategory] = useState({
    categoryId: null,
    categoryName: "",
    categoryDescription: "",
    categoryImage: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  const [page, setPage] = useState(1);
  const itemsPerPage = 5;


  // ✅ FILTER STATE
  const [selectedCategory, setSelectedCategory] = useState("ALL");

   // ✅ FILTER LOGIC
   const filteredCategories =
   selectedCategory === "ALL"
     ? categories
     : categories.filter(
         (cat) => cat.categoryId === selectedCategory
       );

       const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

       const paginatedCategories = filteredCategories.slice(
         (page - 1) * itemsPerPage,
         page * itemsPerPage
       );

  

  useEffect(() => {
    if (!adminId) {
      setTimeout(() => {
        setError("Admin ID not found in session.");
        setLoading(false);
      }, 0);
      return;
    }

    getAllCategories(adminId)
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => setError("Failed to fetch categories"))
      .finally(() => setLoading(false));
  }, [adminId]);

  const handleChange = (e) => {
    setNewCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditChange = (e) => {
    setEditCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.categoryName || !newCategory.categoryDescription) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
      return;
    }
    try {
      await addCategory(adminId, newCategory);
      setSnackbar({
        open: true,
        message: "Category added successfully",
        severity: "success",
      });
      setCategories((prev) => [
        ...prev,
        { ...newCategory, categoryId: prev.length + 1 },
      ]);
      setNewCategory({ categoryName: "", categoryDescription: "", categoryImage: "" });
      setOpenAdd(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add category",
        severity: "error",
      });
    }
  };

  const handleEditOpen = (category) => {
    setEditCategory(category);
    setOpenEdit(true);
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategory(adminId, editCategory.categoryId, {
        categoryName: editCategory.categoryName,
        categoryDescription: editCategory.categoryDescription,
        categoryImage: editCategory.categoryImage,
      });

      setCategories((prev) =>
        prev.map((cat) =>
          cat.categoryId === editCategory.categoryId
            ? editCategory
            : cat
        )
      );

      setSnackbar({
        open: true,
        message: "Category updated successfully",
        severity: "success",
      });

      setOpenEdit(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update category",
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
            Manage Categories
          </Typography>
          <Button
            variant="contained"
            sx={containedButtonStyle}
            onClick={() => setOpenAdd(true)}
          >
            Add Category
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#374151", mb: 4 }} />

        <Grid container spacing={3}>
          {categories.length === 0 && (
            <Typography color="#d1d5db" sx={{ mt: 2 }}>
              No categories found.
            </Typography>
          )}

        <FormControl fullWidth sx={{}}>
          <InputLabel sx={{ color: "#e0e7ff" }}>
            Filter Category
          </InputLabel>
          <Select
            value={selectedCategory}
            label="Filter Category"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            sx={{
              bgcolor: "#374151",
              color: "white",
            }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ mb: 3 }} />

          {paginatedCategories.map((cat) => (
            <Grid key={cat.categoryId} item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#374151",
                  borderRadius: 2,
                  boxShadow: "0 2px 6px rgba(255, 255, 255, 0.3)",
                  height: "100%",
                  color:"white"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#e0e7ff", mb: 1, fontWeight: 600 }}
                >
                  {cat.categoryName.toUpperCase()}
                </Typography>

                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  {cat.categoryDescription}
                </Typography>
            

                {cat.categoryImage && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={cat.categoryImage}
                      alt={cat.categoryName}
                      style={{ width:"250px",height:"200px", borderRadius: 8 }}
                    />
                  </Box>
                )}

                <Button
                  size="small"
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => handleEditOpen(cat)}
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

      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Category Name"
            name="categoryName"
            value={newCategory.categoryName}
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
            label="Category Description"
            name="categoryDescription"
            value={newCategory.categoryDescription}
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

          <TextField
            margin="normal"
            label="Category Image URL"
            name="categoryImage"
            value={newCategory.categoryImage}
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
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenAdd(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCategory}
            sx={containedButtonStyle}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Category Name"
            name="categoryName"
            value={editCategory.categoryName}
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
            label="Category Description"
            name="categoryDescription"
            value={editCategory.categoryDescription}
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
            label="Category Image URL"
            name="categoryImage"
            value={editCategory.categoryImage}
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
          <Button onClick={() => setOpenEdit(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateCategory}
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

export default AdminCategory;
