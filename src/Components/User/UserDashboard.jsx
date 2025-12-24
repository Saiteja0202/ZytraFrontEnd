import React, { useEffect, useState, useMemo } from "react";
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
  TextField,
  Badge,
  Rating,
  Pagination,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Footer from "../Others/Footer";
import {
  getAllProducts,
  getProductDetails,
  addToCart,
  getCart,
  reviewProduct,
  updateReview,
} from "../API/UserAPIs";
import {
  getAllBrands,
  getAllCategories,
} from "../API/PublicAPIs";
const getRemainingDays = (endDate) => {
  const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const HorizontalScroller = ({ children }) => (
  <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
    {children}
  </Box>
);

const CarouselCard = ({ title, image, discount, onClick }) => (
  <Card
    onClick={onClick}
    sx={{ minWidth: 220, cursor: "pointer", borderRadius: 2 }}
  >
    {discount && (
      <Chip label={discount} color="error" size="small" sx={{ m: 1 }} />
    )}
    <CardMedia
      component="img"
      height="140"
      image={image || "/image-placeholder.png"}
      sx={{ objectFit: "contain" }}
    />
    <Typography fontWeight="bold" sx={{ p: 1 }}>
      {title}
    </Typography>
  </Card>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("HOME");

  const [mainImage, setMainImage] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  const isCartPage = location.pathname.includes("user-cart");
  const isOrdersPage = location.pathname.includes("user-orders");
  const isProfilePage = location.pathname.includes("user-profile");

  useEffect(() => {
    if (!userId || !token) navigate("/user-login");
  }, [userId, token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await getAllProducts(userId);
        const data = resProducts.data || resProducts;
        setProducts(data);
  
        const shuffled = [...data];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setRecommended(shuffled.slice(0, 10));
  
        const resCart = await getCart(userId);
        setCart(resCart.data?.carts || []);
      } catch (error) {
        console.error("Failed to fetch products or cart:", error);
      }
    };
  
    fetchData();
  }, [userId]);
  const [allCategories, setAllCategories] = useState([]);
const [allBrands, setAllBrands] = useState([]);

const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 10;

// Calculate the products to display on current page

const handlePageChange = (event, value) => {
  setCurrentPage(value);
};

useEffect(() => {
  const fetchCategoriesBrands = async () => {
    try {
      const categoriesRes = await getAllCategories();
      setAllCategories(categoriesRes || []);

      const brandsRes = await getAllBrands();
      setAllBrands(brandsRes || []);
    } catch (err) {
      console.error("Failed to fetch categories or brands:", err);
    }
  };
  fetchCategoriesBrands();
}, []);


  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.categoryName !== selectedCategory) return false;
      if (selectedBrand && p.brandName !== selectedBrand) return false;
      if (
        searchTerm &&
        !p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchTerm]);

  const todayDeals = useMemo(
    () =>
      products.filter(
        (p) => p.discountValue > 0 && getRemainingDays(p.endDate) > 0
      ),
    [products]
  );

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.categoryName))],
    [products]
  );

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brandName))],
    [products]
  );

  const brandsByCategory = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (!map[p.categoryName]) map[p.categoryName] = new Set();
      map[p.categoryName].add(p.brandName);
    });
    return Object.entries(map).map(([category, brands]) => ({
      category,
      brands: [...brands],
    }));
  }, [products]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);
  

  const handleProductClick = async (id) => {
    const res = await getProductDetails(userId, id);
    const product = res.data || res;
    setSelectedProduct(product);
    setViewMode("PRODUCT");
    setMainImage(product.imageFrontView);

    const review = product.allReviews?.find(
      (r) => r.userId === Number(userId)
    );
    setUserRating(review?.rating || 0);
    setUserComment(review?.comment || "");
  };


 const handleAddToCart = async (productId) => {
  try {
    if (!productId) return;

    const res = await getProductDetails(userId, productId);
    const product = res.data || res;

    if (!product) {
      alert("Product details not found. Cannot add to cart.");
      return;
    }

    await addToCart(userId, product.productId);
    const resCart = await getCart(userId);
    setCart(resCart.data?.carts || []);

    alert(`${product.productName} added to cart!`);
  } catch (err) {
    console.error("Failed to add to cart:", err);
    alert("Failed to add to cart. Please try again.");
  }
};



const handleSubmitReview = async () => {
  try {
    const reviewExists = selectedProduct.allReviews?.some(
      (r) => r.userId === Number(userId)
    );

    const reviewData = { rating: userRating, comment: userComment };

    if (reviewExists) {
      await updateReview(userId, selectedProduct.productId, reviewData);
      alert("Review updated!");
    } else {
      await reviewProduct(userId, selectedProduct.productId, reviewData);
      alert("Review added!");
    }

    // Refresh product details to show updated review
    const res = await getProductDetails(userId, selectedProduct.productId);
    const product = res.data || res;
    setSelectedProduct(product);

  } catch (error) {
    console.error(error);
    // Show backend error message if available
    if (error.response && error.response.data) {
      alert(`Error: ${error.response.data}`);
    } else {
      alert("Failed to submit review. Please try again.");
    }
  }
};


  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              if (isCartPage || isOrdersPage || isProfilePage) {
                navigate("/user-dashboard");
              } else {
                setViewMode("HOME");
              }
            }}          >
            Zytra
          </Typography>

          {!isCartPage && !isOrdersPage && !isProfilePage && (
  <Box sx={{ width: "40%" }}>
    <TextField
      fullWidth
      size="small"
      placeholder="Search products"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setViewMode("LIST");
      }}
      sx={{
        input: {
          color: "white",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          transition: "all 0.3s ease",
          backgroundColor: "rgba(255,255,255,0.08)",

          "& fieldset": {
            borderColor: "rgba(255,255,255,0.6)",
          },
          "&:hover fieldset": {
            borderColor: "white",
          },
          "&.Mui-focused fieldset": {
            borderColor: "white",
            boxShadow: "0 0 8px rgba(255,255,255,0.6)",
          },
        },
        "& input::placeholder": {
          color: "rgba(255,255,255,0.7)",
          opacity: 1,
        },
      }}
    />
  </Box>
)}

          

<Stack direction="row" spacing={2}>
  {/* Cart */}
  <Button
    onClick={() => navigate("user-cart")}
    sx={{
      color: "white",
      borderRadius: 2,
      px: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.15)",
        transform: "scale(1.08)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      },
    }}
  >
    <Badge
      badgeContent={cart.length}
      color="error"
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "0.75rem",
        },
      }}
    >
      <ShoppingCartIcon sx={{ fontSize: 26 }} />
    </Badge>
  </Button>

  {/* Orders */}
  <Button
    onClick={() => navigate("user-orders")}
    sx={{
      color: "white",
      fontWeight: 600,
      borderRadius: 2,
      px: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.15)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      },
    }}
  >
    Orders
  </Button>

  {/* Profile */}
  <Button
    onClick={() => navigate("user-profile")}
    sx={{
      color: "white",
      fontWeight: 600,
      borderRadius: 2,
      px: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.15)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      },
    }}
  >
    Profile
  </Button>
</Stack>

        </Toolbar>
      </AppBar>

      {!isCartPage && !isOrdersPage && !isProfilePage && (
        <Container sx={{ mt: 12, mb: 10 }}>
          {/* HOME VIEW */}
          {viewMode === "HOME" && (
            <>
              <Typography variant="h5">🔥 Today’s Deals</Typography>
              <HorizontalScroller>
                {todayDeals.map((p) => (
                  <CarouselCard
                    key={p.productId}
                    title={p.productName}
                    image={p.imageFrontView}
                    discount={`${p.discountValue}${p.discountType === 'PERCENT' ? '%' : '₹'} OFF`}
                    onClick={() => handleProductClick(p.productId)}
                  />
                ))}
              </HorizontalScroller>

              <Typography variant="h5" sx={{ mt: 4 }}>
                ⭐ Recommended
              </Typography>
              <HorizontalScroller>
                {recommended.map((p) => (
                  <CarouselCard
                    key={p.productId}
                    title={p.productName}
                    image={p.imageFrontView}
                    onClick={() => handleProductClick(p.productId)}
                  />
                ))}
              </HorizontalScroller>

              <Typography variant="h5" sx={{ mt: 4 }}>
                🛍 Shop by Category
              </Typography>
              <HorizontalScroller>
                {categories.map((c) => (
                  <CarouselCard
                    key={c}
                    title={c}
                    image={allCategories.find(cat => cat.categoryName === c)?.categoryImage}
                    onClick={() => {
                      setSelectedCategory(c);
                      setViewMode("LIST");
                    }}
                  />
                ))}
              </HorizontalScroller>

              <Typography variant="h5" sx={{ mt: 4 }}>
                🏷 Top Brands
              </Typography>
              <HorizontalScroller>
                {brands.map((b) => (
                  <CarouselCard
                    key={b}
                    title={b}
                    image={allBrands.find(brand => brand.brandName === b)?.brandImage}
                    onClick={() => {
                      setSelectedBrand(b);
                      setViewMode("LIST");
                    }}
                  />
                ))}
              </HorizontalScroller>

              <Typography variant="h5" sx={{ mt: 4 }}>
                🏷 Brands by Category
              </Typography>
              {brandsByCategory.map(({ category, brands }) => (
                <Box key={category} sx={{ mt: 3 }}>
                  <Typography variant="h6">{category}</Typography>
                  <HorizontalScroller>
                    {brands.map((brand) => (
                      <CarouselCard
                        key={brand}
                        title={brand}
                        image={allBrands.find(brandItem => brandItem.brandName === brand)?.brandImage}
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedBrand(brand);
                          setViewMode("LIST");
                        }}
                      />
                    ))}
                  </HorizontalScroller>
                </Box>
              ))}
            </>
          )}

         {/* LIST VIEW */}
       
{viewMode === "LIST" && (
  <>
    <Button
      onClick={() => {
        setViewMode("HOME");
        setSelectedCategory(null);
        setSelectedBrand(null);
        setSearchTerm("");
      }}
    >
      ← Back
    </Button>

    <Grid container spacing={3}>
      {paginatedProducts.map((p) => (
        <Grid item xs={12} sm={6} md={4} key={p.productId}>
          <Card sx={{ p: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardMedia
              component="img"
              height="200"
              image={p.imageFrontView}
              sx={{ objectFit: "contain", cursor: "pointer" }}
              onClick={() => handleProductClick(p.productId)}
            />
            <Box p={2}>
              <Typography fontWeight="bold">{p.productName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                {p.productDescription.length > 60
                  ? p.productDescription.substring(0, 20) + "..."
                  : p.productDescription}
              </Typography>
              {p.discountValue > 0 && (
                <Typography color="error" fontWeight="bold">
                  {p.discountType === "AMOUNT"
                    ? `₹${p.discountValue} OFF`
                    : `${p.discountValue}% OFF`}
                </Typography>
              )}
              <Typography fontWeight="bold" variant="h6">
                ₹{p.totalPrice}{" "}
                {p.discountValue > 0 && (
                  <Typography
                    component="span"
                    sx={{ textDecoration: "line-through", color: "#999", ml: 1 }}
                  >
                    ₹{p.actualPrice}
                  </Typography>
                )}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => handleAddToCart(p.productId)}
              >
                Add to Cart
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Pagination */}
    <Box display="flex" justifyContent="center" mt={4}>
      <Pagination
        count={Math.ceil(filteredProducts.length / productsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </Box>
  </>
)}


          {/* PRODUCT VIEW */}
          {viewMode === "PRODUCT" && selectedProduct && (
            <Box>
              <Button onClick={() => setViewMode("LIST")}>← Back</Button>
              <Stack direction={{ xs: "column", md: "row" }} spacing={4} mt={2}>
                {/* Images */}
                <Box>
                  <CardMedia
                    component="img"
                    height="400"
                    image={mainImage}
                    sx={{ objectFit: "contain", cursor: "pointer" }}
                  />
                  <Stack direction="row" spacing={1} mt={1}>
                    {[selectedProduct.imageFrontView, selectedProduct.imageTopView, selectedProduct.imageSideView, selectedProduct.imageBottomView].map((url, index) => (
                      <CardMedia
                        key={index}
                        component="img"
                        height="60"
                        image={url}
                        sx={{
                          objectFit: "contain",
                          border: mainImage === url ? "2px solid #1976d2" : "1px solid #ccc",
                          cursor: "pointer",
                        }}
                        onClick={() => setMainImage(url)}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Product Info */}
                <Box flex={1}>
                  <Typography variant="h4">{selectedProduct.productName}</Typography>

                  {/* Price & Discount */}
                  <Box mb={2}>
                    {selectedProduct.discountValue > 0 && (
                      <Typography color="error" fontWeight="bold">
                        {selectedProduct.discountType === "AMOUNT"
                          ? `₹${selectedProduct.discountValue} OFF`
                          : `${selectedProduct.discountValue}% OFF`}
                      </Typography>
                    )}
                    <Typography variant="h5" fontWeight="bold">
                      ₹{selectedProduct.totalPrice}{" "}
                      {selectedProduct.discountValue > 0 && (
                        <Typography
                          component="span"
                          sx={{ textDecoration: "line-through", color: "#999", ml: 1 }}
                        >
                          ₹{selectedProduct.actualPrice}
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  {/* Add to Cart */}
                  <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleAddToCart(selectedProduct.productId)}>
  Add to Cart
</Button>



                  {/* Description */}
                  <Typography variant="body1" mb={1}>
                    {selectedProduct.productDescription}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" mb={2}>
                    {selectedProduct.productSubDescription}
                  </Typography>

                  {/* Reviews */}
                  <Box>
                    <Typography variant="h6" mb={1}>
                      Your Review
                    </Typography>
                    <Rating
                      value={userRating}
                      onChange={(e, newValue) => setUserRating(newValue)}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Write your review..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      sx={{ mt: 1 }}
                    />
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={handleSubmitReview}
                    >
                      {selectedProduct.allReviews?.some(r => r.userId === Number(userId)) ? "Update Review" : "Add Review"}
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
        </Container>
      )}

      {(isCartPage || isOrdersPage || isProfilePage) && (
        <Box sx={{ mt: 12 }}>
          <Outlet />
        </Box>
      )}

      <Footer />
    </>
  );
};

export default UserDashboard;
