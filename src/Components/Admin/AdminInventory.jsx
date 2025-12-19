import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  getAllInventory,
  addInventory,
  getAllSellers,
  getAllProducts,
  updateInventory,
  getAllCategories,
  getAllSubCategories,
  getAllBrands,
} from "../API/AdminAPIs";

const AdminInventory = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inventory, setInventory] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filteredInventory, setFilteredInventory] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [inventoryForm, setInventoryForm] = useState({
    productId: "",
    stockQuantity: "",
    wareHouseLocation: "",
    sellerId: "",
  });

  const [editingInventoryId, setEditingInventoryId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Filters
  const [filterProduct, setFilterProduct] = useState("");
  const [filterSeller, setFilterSeller] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubcategory, setFilterSubcategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");

  useEffect(() => {
    if (!adminId) {
      setError("Admin ID not found in session.");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [
          inventoryRes,
          sellersRes,
          productsRes,
          categoriesRes,
          subcategories,
          brandsRes,
        ] = await Promise.all([
          getAllInventory(adminId),
          getAllSellers(adminId),
          getAllProducts(adminId),
          getAllCategories(adminId),
          getAllSubCategories(adminId),
          getAllBrands(adminId),
        ]);

        setInventory(inventoryRes.data);
        setFilteredInventory(inventoryRes.data);
        setSellers(sellersRes.data);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setSubcategories(subcategories.data);
        setBrands(brandsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch inventory or related data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [adminId]);

  // Handle filters
  useEffect(() => {
    let tempInventory = [...inventory];

    if (filterProduct) tempInventory = tempInventory.filter(inv => inv.productId === filterProduct);
    if (filterSeller) tempInventory = tempInventory.filter(inv => inv.sellerId === filterSeller);
    if (filterWarehouse)
      tempInventory = tempInventory.filter(
        inv => inv.wareHouseLocation.toLowerCase() === filterWarehouse.toLowerCase()
      );
    if (filterCategory)
      tempInventory = tempInventory.filter(
        inv => products.find(p => p.productId === inv.productId)?.categoryId === filterCategory
      );
    if (filterSubcategory)
      tempInventory = tempInventory.filter(
        inv => products.find(p => p.productId === inv.productId)?.subcategoryId === filterSubcategory
      );
    if (filterBrand)
      tempInventory = tempInventory.filter(
        inv => products.find(p => p.productId === inv.productId)?.brandId === filterBrand
      );

    setFilteredInventory(tempInventory);
  }, [
    filterProduct,
    filterSeller,
    filterWarehouse,
    filterCategory,
    filterSubcategory,
    filterBrand,
    inventory,
    products,
  ]);

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChange = e => {
    setInventoryForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddDialog = () => {
    setInventoryForm({
      productId: "",
      stockQuantity: "",
      wareHouseLocation: "",
      sellerId: "",
    });
    setOpenAdd(true);
  };

  const handleAddInventory = async () => {
    try {
      const res = await addInventory(adminId, inventoryForm);
      setInventory(prev => [...prev, res.data]);
      setSnackbar({ open: true, message: "Inventory added successfully", severity: "success" });
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to add inventory", severity: "error" });
    }
  };

  const openEditDialog = inv => {
    setInventoryForm({
      productId: inv.productId,
      stockQuantity: inv.stockQuantity,
      wareHouseLocation: inv.wareHouseLocation,
      sellerId: inv.sellerId,
    });
    setEditingInventoryId(inv.inventoryId);
    setOpenEdit(true);
  };

  const handleUpdateInventory = async () => {
    try {
      const res = await updateInventory(adminId, editingInventoryId, inventoryForm);
      setInventory(prev =>
        prev.map(inv => (inv.inventoryId === editingInventoryId ? res.data : inv))
      );
      setSnackbar({ open: true, message: "Inventory updated successfully", severity: "success" });
      setOpenEdit(false);
      setEditingInventoryId(null);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to update inventory", severity: "error" });
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 10 }}>
        {error}
      </Typography>
    );

  const buttonStyle = {
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
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ bgcolor: "#1f2937", color: "#f3f4f6", p: 5, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Manage Inventory
          </Typography>
          <Button variant="contained" sx={buttonStyle} onClick={openAddDialog}>
            Add Inventory
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            select
            label="Filter by Product"
            value={filterProduct}
            onChange={e => setFilterProduct(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            <MenuItem value="">All Products</MenuItem>
            {products.map(p => (
              <MenuItem key={p.productId} value={p.productId}>
                {p.productName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Seller"
            value={filterSeller}
            onChange={e => setFilterSeller(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            <MenuItem value="">All Sellers</MenuItem>
            {sellers.map(s => (
              <MenuItem key={s.sellerId} value={s.sellerId}>
                {s.sellerName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Filter by Warehouse"
            value={filterWarehouse}
            onChange={e => setFilterWarehouse(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          />

          <TextField
            select
            label="Filter by Category"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(c => (
              <MenuItem key={c.categoryId} value={c.categoryId}>
                {c.categoryName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Subcategory"
            value={filterSubcategory}
            onChange={e => setFilterSubcategory(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            <MenuItem value="">All Subcategories</MenuItem>
            {subcategories.map(sc => (
              <MenuItem key={sc.subcategoryId} value={sc.subcategoryId}>
                {sc.subCategoryName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Brand"
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            <MenuItem value="">All Brands</MenuItem>
            {brands.map(b => (
              <MenuItem key={b.brandId} value={b.brandId}>
                {b.brandName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Grid container spacing={2}>
          {filteredInventory.length === 0 && (
            <Typography color="#d1d5db" sx={{ mt: 2 }}>
              No inventory found.
            </Typography>
          )}

          {filteredInventory.map(inv => {
            const product = products.find(p => p.productId === inv.productId) || {};
            const productName = product.productName || "";
            const productImage = product.imageFrontView || product.image || "";
            const sellerName = sellers.find(s => s.sellerId === inv.sellerId)?.sellerName || "";

            return (
              <Grid item xs={12} sm={6} md={4} key={inv.inventoryId}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#374151",
                    borderRadius: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    textAlign: "center",
                  }}
                >
                  {productImage && (
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <img
                        src={productImage}
                        alt={productName}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#e0e7ff", mb: 1, fontWeight: 600 }}
                  >
                    {productName.toUpperCase()}
                  </Typography>
                  <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                    Stock Quantity: {inv.stockQuantity}
                  </Typography>
                  <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                    Warehouse: {inv.wareHouseLocation}
                  </Typography>
                  <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>Seller: {sellerName}</Typography>
                  <Typography sx={{ color: "#9ca3af", fontSize: 12, mt: 0.5 }}>
                    Last Updated: {new Date(inv.lastUpdatedAt).toLocaleString()}
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: "#512DA8",
                      color: "white",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#512DA8", boxShadow: "0 0 8px 2px white" },
                    }}
                    onClick={() => openEditDialog(inv)}
                  >
                    Edit
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Add Inventory Dialog */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Add Inventory</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            margin="normal"
            label="Product"
            name="productId"
            value={inventoryForm.productId}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            {products.map(p => (
              <MenuItem key={p.productId} value={p.productId}>
                {p.productName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="normal"
            label="Seller"
            name="sellerId"
            value={inventoryForm.sellerId}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            {sellers.map(s => (
              <MenuItem key={s.sellerId} value={s.sellerId}>
                {s.sellerName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            label="Stock Quantity"
            name="stockQuantity"
            value={inventoryForm.stockQuantity}
            onChange={handleChange}
            fullWidth
            variant="filled"
            type="number"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          />

          <TextField
            margin="normal"
            label="Warehouse Location"
            name="wareHouseLocation"
            value={inventoryForm.wareHouseLocation}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          />
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenAdd(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddInventory} sx={buttonStyle}>
            Add Inventory
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Inventory Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Edit Inventory</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            margin="normal"
            label="Seller"
            name="sellerId"
            value={inventoryForm.sellerId}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          >
            {sellers.map(s => (
              <MenuItem key={s.sellerId} value={s.sellerId}>
                {s.sellerName?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            label="Stock Quantity"
            name="stockQuantity"
            value={inventoryForm.stockQuantity}
            onChange={handleChange}
            fullWidth
            variant="filled"
            type="number"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          />

          <TextField
            margin="normal"
            label="Warehouse Location"
            name="wareHouseLocation"
            value={inventoryForm.wareHouseLocation}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputLabelProps={{ style: { color: "#e0e7ff" } }}
            InputProps={{ style: { color: "#d1d5db", backgroundColor: "#374151" } }}
          />
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenEdit(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateInventory} sx={buttonStyle}>
            Update Inventory
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminInventory;
