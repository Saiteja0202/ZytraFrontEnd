import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { loginAdmin } from "../API/AdminAPIs";
import { useNavigate } from "react-router-dom";
import { logout } from "../API/AuthUtils";

export default function AdminLogin({ onBack }) {
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  useEffect(() => {
    logout();
  }, []);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAdmin(form);

      if (res?.data?.token) {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("adminId", res.data.userId);

        alert("Login successful. Redirecting to Admin Dashboard…");
        navigate("/admin-dashboard");
        console.log("Admin Login Response:", res.data);
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Authentication failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
         
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          background: "transparent",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 420,
            p: isMobile ? 3 : 4,
            borderRadius: 3,
            background: "linear-gradient(135deg,#1e293b,#0f172a)",
            border: "1px solid #1f2937",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            sx={{ color: "#e5e7eb", fontWeight: 800, mb: 3 }}
          >
            Admin Login
          </Typography>

          <form onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              <TextField
                label="AdminName"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ style: { color: "#9ca3af" } }}
                InputProps={{
                  style: { color: "#e5e7eb" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#374151" },
                    "&:hover fieldset": { borderColor: "#6366f1" },
                  },
                }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ style: { color: "#9ca3af" } }}
                InputProps={{
                  style: { color: "#e5e7eb" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#374151" },
                    "&:hover fieldset": { borderColor: "#6366f1" },
                  },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.3,
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg,#6366f1,#22c55e)",
                }}
              >
                {loading ? <CircularProgress size={22} /> : "Login"}
              </Button>

              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                href="/"
                onClick={onBack}
                fullWidth
                sx={{
                  color: "#9ca3af",
                  "&:hover": { color: "#e5e7eb" },
                }}
              >
                Back to Home
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Container>
  );
}
