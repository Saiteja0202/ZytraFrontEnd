import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";

import {
  Treemap,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

import {
  getAllCategories,
  getAllSubCategories,
  getAllBrands,
  getAllSellers,
  getAllProducts,
} from "../API/AdminAPIs";

/* -------------------- Utility -------------------- */

// Generate N random colors
const generateColors = (length) => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    const hue = Math.floor(Math.random() * 360);
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const countItems = (items, key) => {
  const map = {};
  items.forEach((i) => {
    const name = i[key];
    map[name] = (map[name] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, size: value }));
};

const getTopItems = (items, key, topN = 10) => {
  const counted = countItems(items, key);
  return counted.sort((a, b) => b.size - a.size).slice(0, topN);
};

/* -------------------- Cards -------------------- */

const StatCard = ({ title, value }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
      color: "#111827",
      textAlign: "center",
      transition: "transform 0.2s ease",
      "&:hover": { transform: "scale(1.03)" },
    }}
  >
    <Typography variant="body2" sx={{ opacity: 0.7 }}>
      {title}
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "#2563eb" }}>
      {value}
    </Typography>
  </Paper>
);

const ChartCard = ({ title, height = 420, children }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      borderRadius: 3,
      height,
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
    }}
  >
    <Typography
      variant="h6"
      sx={{ mb: 2, color: "#111827", fontWeight: 600 }}
    >
      {title}
    </Typography>
    <Box sx={{ flexGrow: 1 }}>{children}</Box>
  </Paper>
);

/* -------------------- Main -------------------- */

const AdminReports = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    categories: [],
    subcategories: [],
    brands: [],
    sellers: [],
    products: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, s, b, se, p] = await Promise.all([
          getAllCategories(adminId),
          getAllSubCategories(adminId),
          getAllBrands(adminId),
          getAllSellers(adminId),
          getAllProducts(adminId),
        ]);

        setData({
          categories: c.data,
          subcategories: s.data,
          brands: b.data,
          sellers: se.data,
          products: p.data,
        });
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminId]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 12 }}>
        {error}
      </Typography>
    );

  return (
    <Container maxWidth="xl" sx={{ mt: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: "#111827" }}>
        Real-Time Reports
      </Typography>

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Categories" value={data.categories.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Brands" value={data.brands.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Sellers" value={data.sellers.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Products" value={data.products.length} />
        </Grid>
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={4}>
        {/* Categories Treemap */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Category Distribution (Treemap)">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={countItems(data.categories, "categoryName")}
                dataKey="size"
                stroke="#fff"
              >
                {countItems(data.categories, "categoryName").map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={generateColors(data.categories.length)[i]} />
                ))}
              </Treemap>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Brand Radial Gauge */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Brand Share (Radial Gauge)">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={15}
                data={getTopItems(data.brands, "brandName", 8)}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: "insideStart", fill: "#fff" }}
                  background
                  clockWise
                  dataKey="size"
                >
                  {getTopItems(data.brands, "brandName", 8).map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={generateColors(8)[i]} />
                  ))}
                </RadialBar>
                <Tooltip />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Sellers Bubble Grid */}
        <Grid item xs={12}>
          <ChartCard title="Seller vs Product Popularity (Bubble Grid)">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <XAxis type="category" dataKey="name" />
                <YAxis type="number" dataKey="size" />
                <ZAxis type="number" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Sellers"
                  data={getTopItems(data.sellers, "sellerName", 10)}
                >
                  {getTopItems(data.sellers, "sellerName", 10).map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={generateColors(10)[i]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminReports;
