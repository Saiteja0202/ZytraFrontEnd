import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import {
  Logout,
} from "@mui/icons-material";
import { logout } from "../API/AuthUtils";
import HomeIcon from "@mui/icons-material/Home";

import {
  getUserDetails,
  updateProfile,
  updatePassword,
  subscribePrime,
} from '../API/UserAPIs';

const UserProfile = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
 

  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  useEffect(() => {
    if (!userId || !token) return;

    const loadUser = async () => {
      try {
        const res = await getUserDetails(userId);
        setUser(res.data);
        setProfileData(res.data);
      } catch (err) {
        console.error(err);
        window.alert('Failed to load user profile');
      }
    };

    loadUser();
  }, [userId, token]);

  const handleUpdateProfile = async () => {
    const payload = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phoneNumber: profileData.phoneNumber,
      email: profileData.email,
      doorNumber: profileData.doorNumber,
      street: profileData.street,
      village: profileData.village,
      landMark: profileData.landMark,
      city: profileData.city,
      district: profileData.district,
      postalCode: profileData.postalCode,
      state: profileData.state,
      country: profileData.country,
      userName: profileData.userName,
    };

    try {
      const res = await updateProfile(userId, payload);
      window.alert(res?.data?.message || 'Profile updated successfully');
      setOpenProfileDialog(false);

      const updated = await getUserDetails(userId);
      setUser(updated.data);
      setProfileData(updated.data);
    } catch (err) {
      console.error(err);
      window.alert(err?.response?.data?.message || 'Profile update failed');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const res = await updatePassword(userId, passwordData);
      window.alert(res?.data?.message || 'Password updated successfully');
      setOpenPasswordDialog(false);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      window.alert(err?.response?.data?.message || 'Password update failed');
    }
  };

  const handleSubscribePrime = async () => {
    try {
      const res = await subscribePrime(userId);
      window.alert(res?.data?.message || 'Subscribed to Prime successfully');

      const updated = await getUserDetails(userId);
      setUser(updated.data);
      setProfileData(updated.data);
    } catch (err) {
      console.error(err);
      window.alert(err?.response?.data?.message || 'Prime subscription failed');
    }
  };

  if (!user) {
    return (
      <Typography sx={{ textAlign: 'center', mt: 6 }}>
        Loading your account…
      </Typography>
    );
  }


  const handleLogout = () => {
    logout();
    navigate("/user-login");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: ' #f6f6f6' }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          cursor: "pointer",
          color: "primary.main",
          transition: "all 0.3s ease",
          m:3,
          "&:hover": {
            color: "secondary.main",
            transform: "scale(1.05)",
          },
        }}
        onClick={() => navigate("/user-dashboard")}
      >
        <HomeIcon fontSize="medium" />
        <Typography variant="h6" fontWeight="bold">
          Home
        </Typography>
      </Stack>
      <Card sx={{ maxWidth: 1100, mx: 'auto', boxShadow: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              Your Account
            </Typography>

            <Chip
              label={user.memberShipStatus === 'PRIME' ? 'Prime Member' : 'Standard Member'}
              color={user.memberShipStatus === 'PRIME' ? 'success' : 'default'}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><b>Name:</b> {user.firstName} {user.lastName}</Typography>
              <Typography><b>Username:</b> {user.userName}</Typography>
              <Typography><b>Email:</b> {user.email}</Typography>
              <Typography><b>Phone:</b> {user.phoneNumber}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600}>Address</Typography>
              <Typography>
                {user.doorNumber}, {user.street}, {user.city}
              </Typography>
              <Typography>
                {user.state}, {user.country} - {user.postalCode}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" size="large" onClick={() => setOpenProfileDialog(true)}>
              Edit Profile
            </Button>

            <Button variant="outlined" size="large" onClick={() => setOpenPasswordDialog(true)}>
              Change Password
            </Button>

            {user.memberShipStatus !== 'PRIME' && (
              <Button variant="contained" color="success" size="large" onClick={handleSubscribePrime}>
                Join Prime
              </Button>
            )}
            <Button
                        variant="contained"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          backgroundColor: "#ff5f5f",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#e04a4a",
                          },
                          px: 2,
                        }}
                      >
                        Logout
                      </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* UPDATE PROFILE DIALOG */}
      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {[
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['phoneNumber', 'Phone Number'],
              ['email', 'Email'],
              ['doorNumber', 'Door Number'],
              ['street', 'Street'],
              ['village', 'Village'],
              ['landMark', 'Land Mark'],
              ['city', 'City'],
              ['district', 'District'],
              ['postalCode', 'Postal Code'],
              ['state', 'State'],
              ['country', 'Country'],
              ['userName', 'Username'],
            ].map(([key, label]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={label}
                  fullWidth
                  value={profileData[key] || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, [key]: e.target.value })
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPDATE PASSWORD DIALOG */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, oldPassword: e.target.value })
              }
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdatePassword}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
