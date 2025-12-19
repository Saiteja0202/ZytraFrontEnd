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
  addProduct,
  getAllProducts,
  getAllCategories,
  getAllSubCategories,
  getAllBrands,
  getAllSellers,
  getAllDiscounts,
  updateProductDetails,
} from "../API/AdminAPIs";

const AdminProducts = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [productForm, setProductForm] = useState({
    categoryId: "",
    subCategoryId: "",
    brandId: "",
    sellerId: "",
    discountId: "",
    productName: "",
    productDescription: "",
    productSubDescription: "",
    actualPrice: "",
    color: "",
    size: "",
    image: "",
    imageFrontView: "",
    imageTopView: "",
    imageSideView: "",
    imageBottomView: "",
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!adminId) {
      setError("Admin ID not found in session.");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [
          productsRes,
          categoriesRes,
          subCategoriesRes,
          brandsRes,
          sellersRes,
          discountsRes,
        ] = await Promise.all([
          getAllProducts(adminId),
          getAllCategories(adminId),
          getAllSubCategories(adminId),
          getAllBrands(adminId),
          getAllSellers(adminId),
          getAllDiscounts(adminId),
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setSubCategories(subCategoriesRes.data);
        setBrands(brandsRes.data);
        setSellers(sellersRes.data);
        setDiscounts(discountsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products or related data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [adminId]);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    setProductForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [filters, setFilters] = useState({
    categoryId: "",
    subCategoryId: "",
    brandId: "",
    sellerId: "",
    discountId: "",
  });
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const filteredProducts = products.filter((prod) => {
    return (
      (!filters.categoryId || prod.categoryId === filters.categoryId) &&
      (!filters.subCategoryId || prod.subCategoryId === filters.subCategoryId) &&
      (!filters.brandId || prod.brandId === filters.brandId) &&
      (!filters.sellerId || prod.sellerId === filters.sellerId) &&
      (!filters.discountId || prod.discountId === filters.discountId)
    );
  });
    

  const openAddDialog = () => {
    setProductForm({
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      sellerId: "",
      discountId: "",
      productName: "",
      productDescription: "",
      productSubDescription: "",
      actualPrice: "",
      color: "",
      size: "",
      image: "",
      imageFrontView: "",
      imageTopView: "",
      imageSideView: "",
      imageBottomView: "",
    });
    setOpenAdd(true);
  };

  const handleAddProduct = async () => {
    try {
      const res = await addProduct(adminId, productForm);
      setProducts((prev) => [...prev, res.data]);
      setSnackbar({ open: true, message: "Product added successfully", severity: "success" });
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to add product", severity: "error" });
    }
  };

  const openEditDialog = (prod) => {
    setProductForm({ ...prod });
    setEditingProductId(prod.productId);
    setOpenEdit(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await updateProductDetails(adminId, editingProductId, productForm);
      setProducts((prev) =>
        prev.map((p) => (p.productId === editingProductId ? res.data : p))
      );
      setSnackbar({ open: true, message: "Product updated successfully", severity: "success" });
      setOpenEdit(false);
      setEditingProductId(null);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to update product", severity: "error" });
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
      <Box sx={{ bgcolor: "#1f2937", color: " #f3f4f6", p: 5, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Manage Products
          </Typography>
          <Button variant="contained" sx={buttonStyle} onClick={openAddDialog}>
            Add Product
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3}}>
  <TextField
    select
    label="Category"
    name="categoryId"
    value={filters.categoryId}
    onChange={handleFilterChange}
    variant="filled"
    size="small"
    sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}

  >
    <MenuItem value="">All</MenuItem>
    {categories.map((c) => (
      <MenuItem key={c.categoryId} value={c.categoryId}>
        {c.categoryName?.toUpperCase()  || ""}
      </MenuItem>
    ))}
  </TextField>

  <TextField
    select
    label="SubCategory"
    name="subCategoryId"
    value={filters.subCategoryId}
    onChange={handleFilterChange}
    variant="filled"
    size="small"
    sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}
  >
    <MenuItem value="">All</MenuItem>
    {subCategories.map((s) => (
      <MenuItem key={s.subCategoryId} value={s.subCategoryId}>
        {s.subCategoryName?.toUpperCase()  || ""}
      </MenuItem>
    ))}
  </TextField>

  <TextField
    select
    label="Brand"
    name="brandId"
    value={filters.brandId}
    onChange={handleFilterChange}
    variant="filled"
    size="small"
    sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}
  >
    <MenuItem value="">All</MenuItem>
    {brands.map((b) => (
      <MenuItem key={b.brandId} value={b.brandId}>
        {b.brandName?.toUpperCase()  || ""}
      </MenuItem>
    ))}
  </TextField>

  <TextField
    select
    label="Seller"
    name="sellerId"
    value={filters.sellerId}
    onChange={handleFilterChange}
    variant="filled"
    size="small"
    sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}
  >
    <MenuItem value="">All</MenuItem>
    {sellers.map((s) => (
      <MenuItem key={s.sellerId} value={s.sellerId}>
        {s.sellerName?.toUpperCase()  || ""}
      </MenuItem>
    ))}
  </TextField>

  <TextField
    select
    label="Discount"
    name="discountId"
    value={filters.discountId}
    onChange={handleFilterChange}
    variant="filled"
    size="small"
    sx={{
      minWidth: 150,
      "& .MuiSelect-select": {
        color: "white", 
      },
      "& .MuiSvgIcon-root": {
        color: "white", 
      },
      "& .MuiFilledInput-root": {
        border: "1px solid white",
        borderRadius: 4,
      },
      "& .MuiFilledInput-underline:before": {
        borderBottom: "none", 
      },
      "& .MuiFilledInput-underline:after": {
        borderBottom: "none",
      },
      "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
    }}
  InputLabelProps={{ style: { color: "white" } }}
>
  {discounts.map((d) => (
    <MenuItem key={d.discountId} value={d.discountId}>
      { d.discountValue +" - "+d.discountType?.toUpperCase()}
    </MenuItem>
  ))}
  </TextField>
</Box>


        
          <Grid container spacing={2}>
  {filteredProducts.length === 0 && (
    <Typography color="white" sx={{ mt: 2 }}>
      No products found.
    </Typography>
  )}

{filteredProducts.map((prod) => (
  <Grid item xs={12} sm={6} md={4} key={prod.productId}>
    <Box
      sx={{
        p: 2,
        bgcolor: "#374151",
        borderRadius: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}
    >
      {prod.imageFrontView && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src={prod.imageFrontView}
            alt={prod.productName}
            width={100}
            height={100}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ color: "#e0e7ff", mb: 1, fontWeight: 600 }}>
      {prod.productName?.toUpperCase() || ""}
      </Typography>
      <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
        Price: ₹{prod.actualPrice}
      </Typography>
      <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
        Color: {prod.color}, Size: {prod.size}
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, ...buttonStyle }}
        onClick={() => openEditDialog(prod)}
      >
        Edit
      </Button>
    </Box>
  </Grid>
))}

        </Grid>
      </Box>

      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
      >
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            margin="normal"
            label="Category"
            name="categoryId"
            value={productForm.categoryId}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                minWidth: 150,
                "& .MuiSelect-select": {
                  color: "white", 
                },
                "& .MuiSvgIcon-root": {
                  color: "white", 
                },
                "& .MuiFilledInput-root": {
                  border: "1px solid white",
                  borderRadius: 4,
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none", 
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
              }}
            InputLabelProps={{ style: { color: "white" } }}
          >
            {categories.map((c) => (
              <MenuItem key={c.categoryId} value={c.categoryId}>
                {c.categoryName?.toUpperCase() || ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="normal"
            label="SubCategory"
            name="subCategoryId"
            value={productForm.subCategoryId}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                minWidth: 150,
                "& .MuiSelect-select": {
                  color: "white", 
                },
                "& .MuiSvgIcon-root": {
                  color: "white", 
                },
                "& .MuiFilledInput-root": {
                  border: "1px solid white",
                  borderRadius: 4,
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none", 
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
              }}
            InputLabelProps={{ style: { color: "white" } }}
          >
            {subCategories.map((s) => (
              <MenuItem key={s.subCategoryId} value={s.subCategoryId}>
{s.subCategoryName?.toUpperCase() || ""}
</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="normal"
            label="Brand"
            name="brandId"
            value={productForm.brandId}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                minWidth: 150,
                "& .MuiSelect-select": {
                  color: "white", 
                },
                "& .MuiSvgIcon-root": {
                  color: "white", 
                },
                "& .MuiFilledInput-root": {
                  border: "1px solid white",
                  borderRadius: 4,
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none", 
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
              }}
            InputLabelProps={{ style: { color: "white" } }}
          >
            {brands.map((b) => (
              <MenuItem key={b.brandId} value={b.brandId}>
{b.brandName?.toUpperCase() || ""}
</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="normal"
            label="Seller"
            name="sellerId"
            value={productForm.sellerId}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                minWidth: 150,
                "& .MuiSelect-select": {
                  color: "white", 
                },
                "& .MuiSvgIcon-root": {
                  color: "white", 
                },
                "& .MuiFilledInput-root": {
                  border: "1px solid white",
                  borderRadius: 4,
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none", 
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
              }}
            InputLabelProps={{ style: { color: "white" } }}
          >
            {sellers.map((s) => (
              <MenuItem key={s.sellerId} value={s.sellerId}>
{s.sellerName?.toUpperCase() || ""}
</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="normal"
            label="Discount"
            name="discountId"
            value={productForm.discountId}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                minWidth: 150,
                "& .MuiSelect-select": {
                  color: "white", 
                },
                "& .MuiSvgIcon-root": {
                  color: "white", 
                },
                "& .MuiFilledInput-root": {
                  border: "1px solid white",
                  borderRadius: 4,
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none", 
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", 
                  },
              }}
            InputLabelProps={{ style: { color: "white" } }}
          >
            {discounts.map((d) => (
              <MenuItem key={d.discountId} value={d.discountId}>
                { d.discountValue +" - "+d.discountType?.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            label="Product Name"
            name="productName"
            value={productForm.productName}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            
            sx={{
              "& .MuiOutlinedInput-input": {
                color: "white", 
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
            }}
          InputLabelProps={{ style: { color: "white" } }}   
          />

          <TextField
            margin="normal"
            label="Description"
            name="productDescription"
            value={productForm.productDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-input": {
                color: "white", 
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
            }}
          InputLabelProps={{ style: { color: "white" } }}   
          />

          <TextField
            margin="normal"
            label="Sub Description"
            name="productSubDescription"
            value={productForm.productSubDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-input": {
                color: "white", 
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
            }}
          InputLabelProps={{ style: { color: "white" } }}   
          />

          <TextField
            margin="normal"
            label="Price"
            name="actualPrice"
            value={productForm.actualPrice}
            onChange={handleChange}
            fullWidth
            type="number"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-input": {
                color: "white", 
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
            }}
          InputLabelProps={{ style: { color: "white" } }}   
          />

          <TextField
            margin="normal"
            label="Color"
            name="color"
            value={productForm.color}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-input": {
                color: "white", 
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", 
              },
            }}
                   />

          <TextField
            margin="normal"
            label="Size"
            name="size"
            value={productForm.size}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "white" } }}
            sx={{
                "& .MuiOutlinedInput-input": {
                  color: "white", 
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
              }}
          />


<TextField
            margin="normal"
            label="Image URL"
            name="image"
            value={productForm.image}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-input": {
                  color: "white", 
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
              }}
            InputLabelProps={{ style: { color: "white" } }}          />
            

<TextField
            margin="normal"
            label="Front Image URL"
            name="imageFrontView"
            value={productForm.imageFrontView}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-input": {
                  color: "white", 
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
              }}
            InputLabelProps={{ style: { color: "white" } }}          />
            

          <TextField
            margin="normal"
            label="Top Image URL"
            name="imageTopView"
            value={productForm.imageTopView}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-input": {
                  color: "white", 
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
              }}
            InputLabelProps={{ style: { color: "white" } }}          />

          <TextField
            margin="normal"
            label="Side Image URL"
            name="imageSideView"
            value={productForm.imageSideView}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-input": {
                  color: "white", 
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
              }}
            InputLabelProps={{ style: { color: "white" } }}          />

          <TextField
            margin="normal"
            label="Bottom Image URL"
            name="imageBottomView"
            value={productForm.imageBottomView}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-input": {
                  color: "white", 
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", 
                },
              }}
            InputLabelProps={{ style: { color: "white" } }}          />
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenAdd(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddProduct} sx={buttonStyle}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

     {/* Edit Product Dialog */}
<Dialog
  open={openEdit}
  onClose={() => setOpenEdit(false)}
  fullWidth
  maxWidth="sm"
  PaperProps={{ sx: { bgcolor: "#1f2937", color: "#f3f4f6" } }}
>
  <DialogTitle>Edit Product</DialogTitle>
  <DialogContent dividers>
    <TextField
      select
      margin="normal"
      label="Category"
      name="categoryId"
      value={productForm.categoryId}
      onChange={handleChange}
      fullWidth
      variant="filled"
      sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
      }}
    InputLabelProps={{ style: { color: "white" } }}
    >
      {categories.map((c) => (
        <MenuItem key={c.categoryId} value={c.categoryId}>
{c.categoryName?.toUpperCase() || ""}
</MenuItem>
      ))}
    </TextField>

    <TextField
      select
      margin="normal"
      label="SubCategory"
      name="subCategoryId"
      value={productForm.subCategoryId}
      onChange={handleChange}
      fullWidth
      variant="filled"
      sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
      }}
    InputLabelProps={{ style: { color: "white" } }}
    >
      {subCategories.map((s) => (
        <MenuItem key={s.subCategoryId} value={s.subCategoryId}>
{s.subCategoryName?.toUpperCase() || ""}
</MenuItem>
      ))}
    </TextField>

    <TextField
      select
      margin="normal"
      label="Brand"
      name="brandId"
      value={productForm.brandId}
      onChange={handleChange}
      fullWidth
      variant="filled"
      sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
      }}
    InputLabelProps={{ style: { color: "white" } }}
    >
      {brands.map((b) => (
        <MenuItem key={b.brandId} value={b.brandId}>
{b.brandName?.toUpperCase() || ""}
</MenuItem>
      ))}
    </TextField>

    <TextField
      select
      margin="normal"
      label="Seller"
      name="sellerId"
      value={productForm.sellerId}
      onChange={handleChange}
      fullWidth
      variant="filled"
      sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
      }}
    InputLabelProps={{ style: { color: "white" } }}
    >
      {sellers.map((s) => (
        <MenuItem key={s.sellerId} value={s.sellerId}>
{s.sellerName?.toUpperCase() || ""}
</MenuItem>
      ))}
    </TextField>

    <TextField
      select
      margin="normal"
      label="Discount"
      name="discountId"
      value={productForm.discountId}
      onChange={handleChange}
      fullWidth
      variant="filled"
      sx={{
        minWidth: 150,
        "& .MuiSelect-select": {
          color: "white", 
        },
        "& .MuiSvgIcon-root": {
          color: "white", 
        },
        "& .MuiFilledInput-root": {
          border: "1px solid white",
          borderRadius: 4,
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none", 
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", 
          },
      }}
    InputLabelProps={{ style: { color: "white" } }}
    >
      {discounts.map((d) => (
        <MenuItem key={d.discountId} value={d.discountId}>
          { d.discountValue +" - "+d.discountType?.toUpperCase()  || ""}
        </MenuItem>
      ))}
    </TextField>

    <TextField
      margin="normal"
      label="Product Name"
      name="productName"
      value={productForm.productName}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Description"
      name="productDescription"
      value={productForm.productDescription}
      onChange={handleChange}
      fullWidth
      multiline
      rows={3}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Sub Description"
      name="productSubDescription"
      value={productForm.productSubDescription}
      onChange={handleChange}
      fullWidth
      multiline
      rows={2}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Price"
      name="actualPrice"
      value={productForm.actualPrice}
      onChange={handleChange}
      fullWidth
      type="number"
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Color"
      name="color"
      value={productForm.color}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Size"
      name="size"
      value={productForm.size}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />

    {/* Image fields */}

    <TextField
      margin="normal"
      label="Image URL"
      name="image"
      value={productForm.image}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Front Image URL"
      name="imageFrontView"
      value={productForm.imageFrontView}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Top Image URL"
      name="imageTopView"
      value={productForm.imageTopView}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Side Image URL"
      name="imageSideView"
      value={productForm.imageSideView}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
    <TextField
      margin="normal"
      label="Bottom Image URL"
      name="imageBottomView"
      value={productForm.imageBottomView}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-input": {
          color: "white", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white", 
        },
      }}
    InputLabelProps={{ style: { color: "white" } }}  
    />
  </DialogContent>

  <DialogActions sx={{ pr: 3, pb: 2 }}>
    <Button onClick={() => setOpenEdit(false)} sx={outlinedButtonStyle}>
      Cancel
    </Button>
    <Button variant="contained" onClick={handleUpdateProduct} sx={buttonStyle}>
      Update Product
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

export default AdminProducts;
