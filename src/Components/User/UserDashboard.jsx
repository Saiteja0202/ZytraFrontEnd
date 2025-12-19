import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  Chip,
  Container,
  Stack,
  Pagination,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Footer from "../Others/Footer";
import Badge from "@mui/material/Badge";

import { getAllProducts, addToCart, getProductDetails,getCart } from "../API/UserAPIs";

const getRemainingDays = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) navigate("/user-login");
  }, [userId, token, navigate]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  const location = useLocation();
  const isCartPage = location.pathname.includes("user-cart");
  const isOrdersPage = location.pathname.includes("user-orders");

  // Selected main image in single product view:
  const [selectedImage, setSelectedImage] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCart(userId);
        // Set cart to the array of products, not the whole object
        setCart(res.data?.carts || []);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCart();
  }, [userId]);
  


  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getAllProducts(userId);
        setProducts(res.data || res);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [userId]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        if (
          !p.productName.toLowerCase().includes(term) &&
          !p.brandName.toLowerCase().includes(term)
        )
          return false;
      }
      if (selectedCategory && p.categoryName !== selectedCategory) return false;
      if (selectedSubcategory && p.subCategoryName !== selectedSubcategory) return false;
      if (selectedBrand && p.brandName !== selectedBrand) return false;
      if (selectedSeller && p.sellerName !== selectedSeller) return false;
      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedSubcategory, selectedBrand, selectedSeller]);
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredProducts, page]);

  // Search suggestions handler
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setSearchSubmitted(false);
    if (!value.trim()) return setSuggestions([]);
    const term = value.toLowerCase();
    setSuggestions(
      products
        .filter(
          (p) =>
            p.productName.toLowerCase().includes(term) ||
            p.brandName.toLowerCase().includes(term)
        )
        .slice(0, 6)
    );
  };

  // Load single product details on product click
  const handleProductClick = async (productId) => {
    setProductLoading(true);
    try {
      const res = await getProductDetails(userId, productId);
      const productData = res.data || res;
      setSelectedProduct(productData);

      // Reset selectedImage to front view on product change
      setSelectedImage(productData.imageFrontView);
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: "#0D1B2A" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        mb: { xs: 1, sm: 0 }, 
        cursor:"pointer",
      }}
      onClick={() => navigate("/user-dashboard")}
    >
      <img
        src="/Zytra_Logo.png"
        alt="Zytra Logo"
        style={{
          width: 30,
          height: 30,
          marginRight: 8,
          verticalAlign: "middle",
        }}
      />
      Zytra
    </Typography>

          {!isOrdersPage &&!isCartPage && (
            <Box sx={{ width: "40%", position: "relative" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchSubmitted(true);
                  setSuggestions([]);
                }
              }}
              sx={{ background: "white", borderRadius: 1 }}
            />
            {suggestions.length > 0 && (
              <Paper sx={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 20 }}>
                <List>
                  {suggestions.map((s) => (
                    <ListItemButton
                      key={s.productId}
                      onClick={() => {
                        handleProductClick(s.productId);
                        setSuggestions([]);
                        setSearchSubmitted(true);
                      }}
                    >
                      <ListItemText primary={s.productName} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
          )}
          

          <Stack direction="row" spacing={2}>
          <Button onClick={() => navigate("/user-dashboard/user-cart")} color="inherit">
  <Badge badgeContent={cart.length} color="error">
    <ShoppingCartIcon />
  </Badge>
</Button>

<Button onClick={() => navigate("/user-dashboard/user-orders")} color="inherit">
    My Orders
  </Button>
            <Button onClick={() => navigate("/profile")} color="inherit">
              Profile
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      { !isOrdersPage && !isCartPage && (
  <>
       <Box
  sx={{
    position: "fixed",
    top: 64,
    width: "100%",
    background: "#fff",
    borderBottom: "1px solid #eee",
    zIndex: 10,
  }}
>
  <Container maxWidth="xl">
    <Stack direction="row" spacing={3} sx={{ py: 2 }} flexWrap="wrap">

      
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory || ""}
          label="Category"
          onChange={(e) => setSelectedCategory(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {[...new Set(products.map((p) => p.categoryName))].map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* SUBCATEGORY FILTER */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Subcategory</InputLabel>
        <Select
          value={selectedSubcategory || ""}
          label="Subcategory"
          onChange={(e) => setSelectedSubcategory(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {[...new Set(products.map((p) => p.subCategoryName))].map((sc) => (
            sc && <MenuItem key={sc} value={sc}>{sc}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* BRAND FILTER */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Brand</InputLabel>
        <Select
          value={selectedBrand || ""}
          label="Brand"
          onChange={(e) => setSelectedBrand(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {[...new Set(products.map((p) => p.brandName))].map((b) => (
            <MenuItem key={b} value={b}>
              {b}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* SELLER FILTER */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Seller</InputLabel>
        <Select
          value={selectedSeller || ""}
          label="Seller"
          onChange={(e) => setSelectedSeller(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {[...new Set(products.map((p) => p.sellerName))].map((s) => (
            s && <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  </Container>
</Box>
  </>
      )}
 


      {/* CONTENT */}
      {!isOrdersPage && !isCartPage && (
  <>
    <Container maxWidth="xl" sx={{ mt: 20, mb: 10 }}>
        {loading && (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            Loading products...
          </Typography>
        )}
        {searchSubmitted && !loading && filteredProducts.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            No products found
          </Typography>
        )}

        {/* SINGLE PRODUCT VIEW */}
        {selectedProduct ? (
          <>
            <Button
              sx={{ mb: 3 }}
              variant="outlined"
              onClick={() => setSelectedProduct(null)}
            >
              ← Back to products
            </Button>

            {productLoading ? (
              <Typography sx={{ textAlign: "center", mt: 6 }}>
                Loading product details...
              </Typography>
            ) : (
              <>
                {/* Define images array */}
                {(() => {
                  const images = [
                    selectedProduct.imageFrontView,
                    selectedProduct.imageTopView,
                    selectedProduct.imageSideView,
                    selectedProduct.imageBottomView,
                    ...(selectedProduct.additionalImages || []),
                  ].filter(Boolean); 

                  return (
                    <Card sx={{ p: 4, borderRadius: 3 }}>
                      <Grid container spacing={4} sx={{ justifyContent:"center", mt:5,}}>
                        {/* Thumbnails */}
                        <Grid
                          item
                          xs={2}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            maxHeight: 400,
                            overflowY: "auto",
                          }}
                        >
                          {images.map((img, idx) => (
                            <CardMedia
                              key={idx}
                              component="img"
                              image={img}
                              alt={`Thumbnail ${idx + 1}`}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: "contain",
                                border: "1px solid #ccc",
                                borderRadius: 1,
                                cursor: "pointer",
                                "&:hover": {
                                  borderColor: "primary.main"
                                }
                              }}
                              onClick={() => setSelectedImage(img)}
                            />
                          ))}
                        </Grid>

                        {/* Main image */}
                        <Grid
                          item
                          xs={10}
                          md={5}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={selectedImage || selectedProduct.imageFrontView}
                            alt={selectedProduct.productName}
                            sx={{
                                width: "120%",
                                height: 400,
                                objectFit: "contain",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.5)"
                                }
                              }}
                          />
                        </Grid>

                        {/* Product details */}
                        <Grid item xs={12} md={5}>
                          {selectedProduct.discountValue > 0 &&
                            getRemainingDays(selectedProduct.endDate) > 0 && (
                              <Chip
                                label={`${selectedProduct.discountValue}% OFF`}
                                color="error"
                                sx={{ mb: 1 }}
                              />
                            )}
                          <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {selectedProduct.productName}
                          </Typography>
                          <Typography color="text.secondary" gutterBottom>
                            Brand: {selectedProduct.brandName}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2 }}
                          >
                            <Rating
                              value={selectedProduct.allReviews?.[0]?.rating || 0}
                              readOnly
                            />
                            <Typography variant="body2">
                              ({selectedProduct.allReviews?.length || 0} reviews)
                            </Typography>
                          </Stack>

                          <Typography
                            variant="h5"
                            color="green"
                            fontWeight="bold"
                            gutterBottom
                          >
                            ₹{selectedProduct.totalPrice}
                          </Typography>

                          {selectedProduct.discountValue > 0 &&
                            getRemainingDays(selectedProduct.endDate) > 0 && (
                              <Typography color="error" gutterBottom>
                                Offer ends in {getRemainingDays(selectedProduct.endDate)}{" "}
                                days
                              </Typography>
                            )}

                          <Typography sx={{ mb: 3 }}>
                            {selectedProduct.productDescription}
                          </Typography>

                          <Button
  fullWidth
  size="large"
  sx={{
    background: "#f0d264",
    color: "#000",
    fontWeight: "bold",
    "&:hover": { background: "#e6c200" },
  }}
  onClick={async () => {
    try {
      await addToCart(userId, selectedProduct.productId);
      setCart((prevCart = []) => [
        ...prevCart,
        { cartId: Date.now(), productId: selectedProduct.productId }
      ]);
      alert("Product added to cart!");
      const res = await getCart(userId);
      setCart(res.data?.carts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart. Please try again.");
    }
  }}
  
>
  Add to Cart
</Button>

                        </Grid>
                      </Grid>
                    </Card>
                  );
                })()}
              </>
            )}
          </>
        ) : (
          // PRODUCT GRID VIEW
          <Grid container spacing={3}>
            {paginatedProducts.map((product) => {
              const hasDiscount =
                product.discountValue > 0 && getRemainingDays(product.endDate) > 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={product.productId}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: 2,
                      cursor: "pointer",
                      "&:hover": { boxShadow: 6 },
                      position: "relative",
                    }}
                    onClick={() => handleProductClick(product.productId)}
                  >
                    {hasDiscount && (
                      <Chip
                        label={`${product.discountValue}% OFF`}
                        color="error"
                        size="small"
                        sx={{ position: "absolute", top: 8, left: 8 }}
                      />
                    )}
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageFrontView}
                      sx={{ objectFit: "contain", p: 2 }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography fontWeight="bold" noWrap>
                        {product.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.brandName}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <Rating
                          value={product.allReviews?.[0]?.rating || 0}
                          readOnly
                          size="small"
                        />
                        <Typography variant="caption">
                          ({product.allReviews?.length || 0})
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        {hasDiscount && (
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: "line-through", color: "text.secondary" }}
                          >
                            ₹
                            {Math.round(
                              product.totalPrice / (1 - product.discountValue / 100)
                            )}
                          </Typography>
                        )}
                        <Typography fontWeight="bold" color="green">
                          ₹{product.totalPrice}
                        </Typography>
                      </Stack>
                      <Button
  fullWidth
  sx={{
    mt: 2,
    background: "#f0d264",
    color: "#000",
    fontWeight: "bold",
    "&:hover": { background: "#e6c200" },
  }}
  onClick={async (e) => {
    e.stopPropagation();
    try {
      await addToCart(userId, product.productId);
      setCart((prevCart = []) => [
        ...prevCart,
        { cartId: Date.now(), productId: product.productId }
      ]);
      alert("Product added to cart!");
      const res = await getCart(userId);
      setCart(res.data?.carts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart. Please try again.");
    }
  }}
  
>
  Add to Cart
</Button>

                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* PAGINATION */}
        {!selectedProduct && totalPages > 1 && (
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
          </Stack>
        )}
      
      </Container>
  </>
  )}
    
    {isCartPage && (
      <Box sx={{ mt: 12, mb: 10 }}>
        <Outlet />
      </Box>
    )}
    {isOrdersPage && (
  <Box sx={{ mt: 12, mb: 10 }}>
    <Outlet /> 
  </Box>
)}

      <Footer />
    </>
  );
};

export default UserDashboard;
