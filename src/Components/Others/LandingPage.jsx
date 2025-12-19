import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Skeleton,
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
import Rating from '@mui/material/Rating';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import Footer from "./Footer";
import {
  getAllProducts,
  getAllCategories,
  getAllBrands
} from "../API/PublicAPIs";

import { logout } from "../API/AuthUtils";


const HorizontalScroller = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      overflowX: "auto",
      pb: 2,
      "&::-webkit-scrollbar": { display: "none" }
    }}
  >
    {children}
  </Box>
);

const getRemainingDays = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const CarouselCard = ({ title, image, discount, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      minWidth: 220,
      cursor: "pointer",
      borderRadius: 2,
      position: "relative",
      textAlign: "center",
      "&:hover": { boxShadow: 6 }
    }}
  >
    {discount && (
      <Chip
        label={discount}
        color="error"
        size="small"
        sx={{ position: "absolute", top: 8, left: 8 }}
      />
    )}

    <CardMedia
      component="img"
      height="140"
      image={image || "/image-placeholder.png"}
      sx={{ objectFit: "contain", p: 1 }}
    />

    <Typography fontWeight={600} sx={{ p: 1, textTransform: "capitalize" }}>
      {title}
    </Typography>
  </Card>
);


const LandingPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);


  useEffect(() => {
    logout();
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [p, c, b] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllBrands()
        ]);

        setProducts(p);
        setCategories(c);
        setBrands(b);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    selectedBrand,
    selectedProduct,
    selectedSeller,
    searchTerm,
    selectedProductId
  ]);
  

  const isProductView = Boolean(selectedProductId);

  const isLandingMode =
  !isProductView &&
  !searchTerm.trim() &&
  !selectedCategory &&
  !selectedBrand &&
  !selectedProduct &&
  !selectedSeller;



  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedProductId) {
        return p.productId === selectedProductId;
      }
  
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          p.productName.toLowerCase().includes(term) ||
          p.brandName.toLowerCase().includes(term)
        );
      }
  
      if (selectedCategory && p.categoryName !== selectedCategory) {
        return false;
      }
  
      if (selectedBrand && p.brandName !== selectedBrand) {
        return false;
      }
  
      if (selectedProduct && p.productName !== selectedProduct) {
        return false;
      }
  
      if (selectedSeller && p.sellerStatus !== selectedSeller) {
        return false;
      }
  
      return true;
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedProduct,
    selectedSeller,
    selectedProductId
  ]);
  

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [filteredProducts, page]);


  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setSearchSubmitted(false);
    setPage(1);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

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

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setSuggestions([]);
      setSearchSubmitted(true);
    }
  };

  const deals = products.filter((p) => p.discountValue > 0);

  const getRandomProducts = (count = 6) =>
    [...products].sort(() => 0.5 - Math.random()).slice(0, count);


  const brandsByCategory = useMemo(() => {
    const map = {};

    products.forEach((p) => {
      if (!p.categoryName || !p.brandName) return;

      if (!map[p.categoryName]) {
        map[p.categoryName] = new Set();
      }

      map[p.categoryName].add(p.brandName);
    });

    return Object.entries(map).map(([categoryName, brandSet]) => ({
      categoryName,
      brands: brands.filter((b) => brandSet.has(b.brandName))
    }));
  }, [products, brands]);

  return (
    <>
      <AppBar position="sticky" sx={{ background: "#0D1B2A" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
          >
            <img
              src="/Zytra_Logo.png"
              alt="Zytra"
              style={{ width: 30, height: 30, marginRight: 8 }}
            />
            Zytra
          </Typography>

          <Box sx={{ position: "relative", width: "40%" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchSubmit}
              sx={{ background: "white", borderRadius: 1 }}
            />

            {suggestions.length > 0 && (
              <Paper sx={{ position: "absolute", top: 40, left: 0, right: 0 }}>
                <List>
                  {suggestions.map((s) => (
                    <ListItemButton
                      key={s.productId}
                      onClick={() => {
                        setSearchTerm(s.productName);
                        setSearchSubmitted(true);
                        setSuggestions([]);
                      }}
                    >
                      <ListItemText primary={s.productName} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Stack direction="row" spacing={3} alignItems="center">
          <Tooltip title="Cart" arrow>
  <Button
    onClick={() => navigate("/user-login")}
    sx={{
      minWidth: "auto",
      color: "white",
      borderRadius: "50%",
      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
    }}
  >
    <ShoppingCartIcon />
  </Button>
</Tooltip>


  <Button
    variant="contained"
    onClick={() => navigate("/user-login")}
  >
    Login
  </Button>

  <Button
    variant="outlined"
    onClick={() => navigate("/user-registration")}
    sx={{ color: "white", borderColor: "white" }}
  >
    Register
  </Button>
</Stack>

        </Toolbar>
      </AppBar>
      <Box
  sx={{
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 64, // below main navbar
    zIndex: 10,
  }}
>
  <Container maxWidth="xl">
    <Stack
      direction="row"
      spacing={16}
      alignItems="center"
      flexWrap="wrap"
      sx={{ py: 2 }}
    >
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory || ""}
          label="Category"
          onChange={(e) => {
            setSelectedCategory(e.target.value || null);
            setPage(1);
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.categoryId} value={c.categoryName}>
              {c.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* BRAND */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Brand</InputLabel>
        <Select
          value={selectedBrand || ""}
          label="Brand"
          onChange={(e) => {
            setSelectedBrand(e.target.value || null);
            setPage(1);
          }}
        >
          <MenuItem value="">All Brands</MenuItem>
          {brands.map((b) => (
            <MenuItem key={b.brandId} value={b.brandName}>
              {b.brandName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* PRODUCT */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Product</InputLabel>
        <Select
          value={selectedProduct}
          label="Product"
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="">All Products</MenuItem>
          {products.map((p) => (
            <MenuItem key={p.productId} value={p.productName}>
              {p.productName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* SELLER */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Seller</InputLabel>
        <Select
          value={selectedSeller}
          label="Seller"
          onChange={(e) => {
            setSelectedSeller(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="">All Sellers</MenuItem>
          <MenuItem value="ACTIVE">Active Sellers</MenuItem>
          <MenuItem value="INACTIVE">Inactive Sellers</MenuItem>
        </Select>
      </FormControl>

      {/* CLEAR FILTERS */}
      <Button
        variant="outlined"
        sx={{
          ml: "auto",
          height: 40,
          textTransform: "none",
          borderColor: "#ef4444",
          color: "#ef4444",
          "&:hover": {
            backgroundColor: "#fee2e2",
            borderColor: "#dc2626",
          },
        }}
        onClick={() => {
          setSelectedCategory(null);
          setSelectedBrand(null);
          setSelectedProduct("");
          setSelectedSeller("");
          setSearchTerm("");
          setPage(1);
        }}
      >
        Clear Filters
      </Button>
    </Stack>
  </Container>
</Box>




      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {isLandingMode && (
          <>
            <Typography variant="h5" fontWeight="bold">
              🔥 Today’s Deals
            </Typography>
            <HorizontalScroller>
  {deals
    .filter((p) => getRemainingDays(p.endDate) > 0)
    .map((p) => (
      <CarouselCard
        key={p.productId}
        title={p.productName}
        image={p.imageFrontView}
        discount={`${p.discountValue}% OFF`}
        onClick={() => {
          setSelectedProductId(p.productId);
          setSearchTerm("");
          setSelectedCategory(null);
          setSelectedBrand(null);
          setSearchSubmitted(true);
          setPage(1);
        }}
      />
    ))}
</HorizontalScroller>

          </>
        )}

        {isLandingMode && (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
              ⭐ Recommended for You
            </Typography>
            <HorizontalScroller>
              {getRandomProducts().map((p) => (
                <CarouselCard
                  key={p.productId}
                  title={p.productName}
                  image={p.imageFrontView}
                  onClick={() => {
                    setSelectedProductId(p.productId);
                    setSearchTerm("");
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                    setSearchSubmitted(true);
                    setPage(1);
                  }}
                  
                />
              ))}
            </HorizontalScroller>
          </>
        )}

        {isLandingMode && (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
              🛍 Shop by Category
            </Typography>
            <HorizontalScroller>
              {categories.map((c) => (
                <CarouselCard
                  key={c.categoryId}
                  title={c.categoryName}
                  image={c.categoryImage}
                  onClick={() => {
                    setSelectedCategory(c.categoryName);
                    setSelectedBrand(null);
                    setSearchSubmitted(true);
                    setPage(1);
                  }}
                />
              ))}
            </HorizontalScroller>
          </>
        )}

        {isLandingMode && (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
              🏷 Top Brands
            </Typography>
            <HorizontalScroller>
              {brands.map((b) => (
                <CarouselCard
                  key={b.brandId}
                  title={b.brandName}
                  image={b.brandImage}
                  onClick={() => {
                    setSelectedBrand(b.brandName);
                    setSelectedCategory(null);
                    setSearchSubmitted(true);
                    setPage(1);
                  }}
                />
              ))}
            </HorizontalScroller>
          </>
        )}

        {isLandingMode && brandsByCategory.length > 0 && (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 5 }}>
              🏷 Brands by Category
            </Typography>

            {brandsByCategory.map(
              ({ categoryName, brands }) =>
                brands.length > 0 && (
                  <Box key={categoryName} sx={{ mt: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mb: 2, textTransform: "capitalize" }}
                    >
                      {categoryName}
                    </Typography>

                    <HorizontalScroller>
                      {brands.map((brand) => (
                        <CarouselCard
                          key={brand.brandId}
                          title={brand.brandName}
                          image={brand.brandImage}
                          onClick={() => {
                            setSelectedCategory(categoryName);
                            setSelectedBrand(brand.brandName);
                            setSearchSubmitted(true);
                            setPage(1);
                          }}
                        />
                      ))}
                    </HorizontalScroller>
                  </Box>
                )
            )}
          </>
        )}




        {(selectedCategory || selectedBrand || isProductView  )  && (
          <Button
            sx={{ m: 3 ,backgroundColor:"black", color:"white"}}
            variant="outlined"
            onClick={() => {
              setSelectedProductId(null);
              setSelectedCategory(null);
              setSelectedBrand(null);
              setSearchSubmitted(false);
              setPage(1);
            }}
          >
          ← Back to browsing
          </Button>
        )}

{(searchSubmitted ||
  selectedCategory ||
  selectedBrand ||
  selectedProduct ||
  selectedSeller ||
  isProductView) &&
  paginatedProducts.map((product) => {
    const images = [
      product.imageFrontView,
      product.imageTopView,
      product.imageSideView,
      product.imageBottomView,
      ...(product.additionalImages || [])
    ].filter(Boolean);

    const hasDiscount = product.discountValue > 0;

    const actualPrice =
      hasDiscount && product.discountType === "PERCENTAGE"
        ? Math.round(
            product.totalPrice / (1 - product.discountValue / 100)
          )
        : hasDiscount
        ? product.totalPrice + product.discountValue
        : product.totalPrice;

    return (
      <Card
        
        key={product.productId}
        sx={{
          p: 3,
          m:5,
          borderRadius: 3,
          boxShadow: 2,
          width:"80vw",
          justifyContent:"center",
        }}

      >
        <Grid container spacing={4}  sx={{ justifyContent:"center"}}>

        <Grid item xs={12} md={4}>
  <Box
    sx={{
      border: "1px solid #eee",
      borderRadius: 2,
      mt: 7,
      p: 2,
      display: "flex",
      gap: 2
    }}
  >
    {/* VERTICAL THUMBNAILS */}
    {images.length > 1 && (
      <Stack spacing={1}>
        {images.map((img, i) => (
          <Box
            key={i}
            component="img"
            src={img}
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
            onClick={(e) => {
              const mainImg =
                e.currentTarget
                  .closest(".MuiGrid-container")
                  ?.querySelector(".main-product-image");
              if (mainImg) mainImg.src = img;
            }}
          />
        ))}
      </Stack>
    )}

    {/* MAIN IMAGE */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center"
      }}
    >
      <CardMedia
        component="img"
        image={images[0]}
        className="main-product-image"
        sx={{
          width: "100%",
          height: 360,
          objectFit: "contain",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.6)"
          }
        }}
      />
    </Box>
  </Box>
</Grid>


          {/* RIGHT DETAILS */}
          <Grid item xs={12} md={8} sx={{ position: "relative" , alignItems:"center"}}>
          {hasDiscount && getRemainingDays(product.endDate) > 0 && (
  <Chip
    label={
      product.discountType === "PERCENTAGE"
        ? `${product.discountValue}% OFF`
        : `₹${product.discountValue} OFF`
    }
    color="error"
    sx={{ position: "absolute", top: 0, right: 0 }}
  />
)}


            <Typography variant="h5" fontWeight="bold">
              {product.productName}
            </Typography>

            {/* TAG CHIPS */}
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              <Chip
                label={`Brand: ${product.brandName}`}
                color="primary"
                size="small"
              />
              {product.color && (
                <Chip
                  label={`Color: ${product.color}`}
                  size="small"
                  sx={{ background: "#f3e8ff", color: "#6b21a8" }}
                />
              )}
              {product.size && (
                <Chip
                  label={`Size: ${product.size}`}
                  size="small"
                  sx={{ background: "#fef9c3", color: "#92400e" }}
                />
              )}
            </Stack>

            {product.allReviews?.length > 0 && (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                              <Rating value={product.allReviews[0].rating} readOnly size="small" />
                              <Typography variant="body2">({product.allReviews.length} reviews)</Typography>
                            </Stack>
                          )}

            {/* PRICE */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
  <Typography
    sx={{
      textDecoration:
        hasDiscount && getRemainingDays(product.endDate) > 0
          ? "line-through"
          : "none",
      color: "text.secondary"
    }}
  >
    ₹{actualPrice}
  </Typography>

  {hasDiscount && getRemainingDays(product.endDate) > 0 && (
    <Typography
      variant="h5"
      fontWeight="bold"
      color="green"
    >
      ₹{product.totalPrice}
    </Typography>
  )}
</Stack>

            {hasDiscount && getRemainingDays(product.endDate) > 0 && (
  <Typography
    variant="caption"
    color="red"
    sx={{ mt: 1, fontWeight: "bold" }}
  >
    Offer ends in {getRemainingDays(product.endDate)} days
  </Typography>
)}

            {/* DESCRIPTION */}
            <Typography sx={{ mt: 2 }} color="text.secondary">
              {product.productDescription}
            </Typography>

            {/* DELIVERY */}
            <Typography fontSize={14} sx={{ mt: 2 }}>
              <b>FREE delivery</b> available
            </Typography>

            {/* ADD TO CART */}
            <Button
  fullWidth
  size="large"
  sx={{
    mt: 3,
    py: 1.6,
    fontWeight: "bold",
    background: "#f0d264",
    color: "#000",
    "&:hover": {
      background: "#e6c200"
    }
  }}
  onClick={() => {
    if (product.sellerStatus === "ACTIVE") {
      navigate("/user-login");
    }
  }}
  disabled={product.sellerStatus !== "ACTIVE"} // disable if inactive
>
  {product.sellerStatus === "ACTIVE" ? "ADD TO CART" : "Not Available"}
</Button>

          </Grid>
        </Grid>
      </Card>
    );
  })}


{(searchSubmitted || selectedCategory || selectedBrand || isProductView) &&
  totalPages > 1 && (
    <Stack alignItems="center" sx={{ mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, v) => setPage(v)}
      />
    </Stack>
  )}


        {loading &&
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} height={140} sx={{ mb: 2 }} />
          ))}
      </Container>
      <Footer />
    </>
  );
};

export default LandingPage;
