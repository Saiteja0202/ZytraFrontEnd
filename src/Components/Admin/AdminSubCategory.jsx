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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination
} from "@mui/material";
import {
  addSubCategory,
  getAllSubCategories,
  getAllCategories,
  updateSubCategory,
} from "../API/AdminAPIs";

const AdminSubCategory = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("ALL");
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [newSubCategory, setNewSubCategory] = useState({
    subCategoryName: "",
    subCategoryDescription: "",
    categoryId: "",
  });

  const [editSubCategory, setEditSubCategory] = useState({
    subCategoryId: null,
    subCategoryName: "",
    subCategoryDescription: "",
    categoryId: "",
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

   

    Promise.all([getAllCategories(adminId), getAllSubCategories(adminId)])
      .then(([catRes, subCatRes]) => {
        setCategories(catRes.data);
        setSubCategories(subCatRes.data);
      })
      .catch(() => setError("Failed to fetch categories or subcategories"))
      .finally(() => setLoading(false));
  }, [adminId]);

  const filteredSubCategories =
    selectedSubCategory === "ALL"
      ? subCategories
      : subCategories.filter(
          (sub) => sub.subCategoryId === selectedSubCategory
        );

  /* ✅ PAGINATION */
  const totalPages = Math.ceil(
    filteredSubCategories.length / ITEMS_PER_PAGE
  );

  const paginatedSubCategories = filteredSubCategories.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );



  const handleChange = (e) => {
    setNewSubCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditSubCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSubCategory = async () => {
    const { subCategoryName, subCategoryDescription, categoryId } =
      newSubCategory;
    if (!subCategoryName || !subCategoryDescription || !categoryId) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
      return;
    }

    try {
      await addSubCategory(adminId, newSubCategory);
      setSnackbar({
        open: true,
        message: "Subcategory added successfully",
        severity: "success",
      });

      setSubCategories((prev) => [
        ...prev,
        {
          ...newSubCategory,
          subCategoryId: prev.length + 1,
          categoryName:
            categories.find((c) => c.categoryId == categoryId)
              ?.categoryName || "",
        },
      ]);

      setNewSubCategory({
        subCategoryName: "",
        subCategoryDescription: "",
        categoryId: "",
      });
      setOpenAdd(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add subcategory",
        severity: "error",
      });
    }
  };

  const handleEditOpen = (sub) => {
    setEditSubCategory(sub);
    setOpenEdit(true);
  };

  const handleUpdateSubCategory = async () => {
    try {
      await updateSubCategory(
        adminId,
        editSubCategory.subCategoryId,
        {
          subCategoryName: editSubCategory.subCategoryName,
          subCategoryDescription:
            editSubCategory.subCategoryDescription,
          categoryId: editSubCategory.categoryId,
        }
      );

      setSubCategories((prev) =>
        prev.map((sub) =>
          sub.subCategoryId === editSubCategory.subCategoryId
            ? editSubCategory
            : sub
        )
      );

      setSnackbar({
        open: true,
        message: "Subcategory updated successfully",
        severity: "success",
      });

      setOpenEdit(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update subcategory",
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
            Manage Subcategories
          </Typography>
          <Button
            variant="contained"
            sx={containedButtonStyle}
            onClick={() => setOpenAdd(true)}
          >
            Add Subcategory
          </Button>
        </Box>


        <Divider sx={{ borderColor: "#374151", mb: 4 }} />

        {/* ✅ SUBCATEGORY DROPDOWN FILTER */}
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel sx={{ color: "#e0e7ff" }}>
            Filter Subcategory
          </InputLabel>
          <Select
            value={selectedSubCategory}
            label="Filter Subcategory"
            onChange={(e) => {setSelectedSubCategory(e.target.value);
              setPage(1);
            }}
            sx={{ bgcolor: "#374151", color: "white" }}
          >
            <MenuItem value="ALL">All Subcategories</MenuItem>
            {subCategories.map((sub) => (
              <MenuItem
                key={sub.subCategoryId}
                value={sub.subCategoryId}
              >
                {sub.subCategoryName.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {subCategories.length === 0 && (
            <Typography color="#d1d5db" sx={{ mt: 2 }}>
              No subcategories found.
            </Typography>
          )}

          {paginatedSubCategories.map((sub) => (
            <Grid key={sub.subCategoryId} item xs={12} sm={6}>
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
                  {sub.subCategoryName.toUpperCase()}
                </Typography>

                <Typography
                  sx={{ color: "#d1d5db", fontSize: 14 }}
                >
                  {sub.subCategoryDescription}
                </Typography>

                <Button
                  size="small"
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => handleEditOpen(sub)}
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
              onChange={(_, value) => setPage(value)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "white",          // numbers
                },
                "& .MuiPaginationItem-icon": {
                  color: "white",          // arrows
                }
              }}
            />
          </Box>
        )}

      </Box>

      {/* ADD SUBCATEGORY DIALOG */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Add New Subcategory</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Subcategory Name"
            name="subCategoryName"
            value={newSubCategory.subCategoryName}
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
            label="Subcategory Description"
            name="subCategoryDescription"
            value={newSubCategory.subCategoryDescription}
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
            select
            margin="normal"
            label="Category"
            name="categoryId"
            value={newSubCategory.categoryId}
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
          >
            {categories.map((cat) => (
              <MenuItem
                key={cat.categoryId}
                value={cat.categoryId}
              >
                {cat.categoryName.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
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
            onClick={handleAddSubCategory}
            sx={containedButtonStyle}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT SUBCATEGORY DIALOG */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Edit Subcategory</DialogTitle>

        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Subcategory Name"
            name="subCategoryName"
            value={editSubCategory.subCategoryName}
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
            label="Subcategory Description"
            name="subCategoryDescription"
            value={editSubCategory.subCategoryDescription}
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
            select
            margin="normal"
            label="Category"
            name="categoryId"
            value={editSubCategory.categoryId}
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
          >
            {categories.map((cat) => (
              <MenuItem
                key={cat.categoryId}
                value={cat.categoryId}
              >
                {cat.categoryName.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
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
            onClick={handleUpdateSubCategory}
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

export default AdminSubCategory;
