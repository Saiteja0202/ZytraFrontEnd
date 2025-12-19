import React, { useEffect, useState } from "react";
import { getAllUserDetails } from "../API/AdminAPIs";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

const AdminAllUsers = () => {
  const adminId = sessionStorage.getItem("adminId");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (!adminId) {
        setError("Admin ID not found in session.");
        setLoading(false);
        return;
      }

      try {
        const response = await getAllUserDetails(adminId);
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [adminId]);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box
        sx={{
          bgcolor: "#1f2937",
          color: "#f3f4f6",
          p: 5,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Admin Registration History
        </Typography>

        {users.length === 0 && (
          <Typography color="#d1d5db" sx={{ mt: 2 }}>
            No users found.
          </Typography>
        )}

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {users.map((user) => (
            <Grid key={user.userId} item xs={12} sm={6} md={4}>
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
                  {user.firstName} {user.lastName}
                </Typography>

                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  <strong>Address:</strong> {user.address}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  <strong>Phone:</strong> {user.phoneNumber}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  <strong>Registered At:</strong> {user.registeredAt}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  <strong>Membership:</strong> {user.memberShipStatus}
                </Typography>
                <Typography sx={{ color: "#d1d5db", fontSize: 14 }}>
                  <strong>Role:</strong> {user.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

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

export default AdminAllUsers;
