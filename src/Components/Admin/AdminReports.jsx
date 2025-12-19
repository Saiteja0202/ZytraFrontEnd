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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  getAllCategories,
  getAllSubCategories,
  getAllBrands,
  getAllSellers,
  getAllProducts,
} from "../API/AdminAPIs";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

/* -------------------- Cards -------------------- */

const StatCard = ({ title, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      background: "linear-gradient(135deg,#1e293b,#0f172a)",
      color: "#e5e7eb",
    }}
  >
    <Typography variant="body2" sx={{ opacity: 0.7 }}>
      {title}
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
      {value}
    </Typography>
  </Paper>
);

const ChartCard = ({ title, height = 420, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      height,
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg,#020617,#020617)",
      border: "1px solid #1f2937",
    }}
  >
    <Typography
      variant="h6"
      sx={{ mb: 2, color: "#e5e7eb", fontWeight: 600 }}
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

  const countItems = (items, key) => {
    const map = {};
    items.forEach((i) => (map[i[key]] = (map[i[key]] || 0) + 1));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const renderPieLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <Container maxWidth="xl" sx={{ mt: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Real Time Analysis
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

      {/* CHARTS – ONE PER ROW */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ChartCard title="Categories Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countItems(data.categories, "categoryName")}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12}>
          <ChartCard title="Brands Share">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countItems(data.brands, "brandName")}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="80%"
                  label={renderPieLabel}
                >
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12}>
          <ChartCard title="Top Sellers">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countItems(data.sellers, "sellerName")}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12}>
          <ChartCard title="Products Share">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countItems(data.products, "productName")}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="80%"
                  label={renderPieLabel}
                >
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminReports;
