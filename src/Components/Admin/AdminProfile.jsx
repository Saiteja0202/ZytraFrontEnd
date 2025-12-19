import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Avatar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  getAdminDetails,
  updateAdminProfile,
  updateAdminPassword,
} from "../API/AdminAPIs";

const AdminProfile = () => {
  const adminId = sessionStorage.getItem("adminId");

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog open states
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  // Form states for edit and password
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    state: "",
    country: "",
    adminName: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!adminId) {
      setTimeout(() => {
        setError("Admin ID not found in session.");
        setLoading(false);
      }, 0);
      return;
    }

    getAdminDetails(adminId)
      .then((res) => {
        setAdminData(res.data);
        setEditData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || "",
          address: res.data.address || "",
          city: res.data.city || "",
          district: res.data.district || "",
          postalCode: res.data.postalCode || "",
          state: res.data.state || "",
          country: res.data.country || "",
          adminName: res.data.adminName || "",
        });
      })
      .catch(() => {
        setTimeout(() => {
          setError("Failed to load admin profile");
        }, 0);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 0);
      });
  }, [adminId]);

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async () => {
    try {
      await updateAdminProfile(adminId, editData);
      setAdminData((prev) => ({ ...prev, ...editData }));
      setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
      setOpenEdit(false);
    } catch {
      setSnackbar({ open: true, message: "Failed to update profile", severity: "error" });
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setSnackbar({ open: true, message: "Please fill both password fields", severity: "warning" });
      return;
    }

    try {
      await updateAdminPassword(adminId, passwordData);
      setSnackbar({ open: true, message: "Password updated successfully", severity: "success" });
      setPasswordData({ oldPassword: "", newPassword: "" });
      setOpenPassword(false);
    } catch {
      setSnackbar({ open: true, message: "Failed to update password", severity: "error" });
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

  const fullName = `${adminData.firstName} ${adminData.lastName}`;
  const firstLetter = adminData.firstName?.charAt(0)?.toUpperCase() || "A";

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
      borderColor: " #512DA8",
      boxShadow: "0 0 8px 2px white",
    },
  };

  return (
    <Container maxWidth="md"  sx={{ mt: "auto", padding: 0}}>

      <Box
        sx={{
          bgcolor: "#1f2937",
          color: "white",
          p: 6,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#7E57C2",
              width: 80,
              height: 80,
              fontSize: 32,
              mb: 2,
            }}
          >
            {firstLetter}
          </Avatar>
          <Typography
            variant="h5"
            sx={{ fontWeight: "700", mb: 0.5, color: "#f9fafb" }}
          >
            {fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#9ca3af" }}>
            Administrator
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              sx={containedButtonStyle}
              onClick={() => setOpenEdit(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              sx={outlinedButtonStyle}
              onClick={() => setOpenPassword(true)}
            >
              Change Password
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#374151", mb: 4}} />

        <Grid container spacing={3}>
          {[
            ["First Name", adminData.firstName],
            ["Last Name", adminData.lastName],
            ["Email", adminData.email],
            ["Phone", adminData.phoneNumber],
            ["Address", adminData.address],
            ["City", adminData.city],
            ["District", adminData.district],
            ["Postal Code", adminData.postalCode],
            ["State", adminData.state],
            ["Country", adminData.country],
            ["Admin Username", adminData.adminName],
            ["Role", adminData.role],
            ["Status", adminData.adminActivityStatus],
          ].map(([label, value], index) => (
            <Grid key={index} item xs={12} sm={6}>
              <Typography
                sx={{ fontWeight: "500" }}
                component="span"
                color="#e0e7ff"
              >
                {label}:
              </Typography>{" "}
              <Typography component="span" sx={{ color: "#d1d5db" }}>
                {value || "-"}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { bgcolor: "#1f2937", color: "#f3f4f6" },
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phoneNumber", type: "tel" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "District", name: "district" },
            { label: "Postal Code", name: "postalCode" },
            { label: "State", name: "state" },
            { label: "Country", name: "country" },
            { label: "Admin Username", name: "adminName" },
          ].map(({ label, name }) => (
            <TextField
              key={name}
              margin="normal"
              label={label}
              name={name}
              value={editData[name]}
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
          ))}
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenEdit(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateProfile} sx={containedButtonStyle}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPassword}
        onClose={() => setOpenPassword(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { bgcolor: "#1f2937", color: "#f3f4f6" },
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Old Password"
            name="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
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
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
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
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setOpenPassword(false)} sx={outlinedButtonStyle}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdatePassword} sx={containedButtonStyle}>
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
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProfile;
