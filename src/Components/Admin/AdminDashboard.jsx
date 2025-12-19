import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  AppBar,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  Person,
  Category,
  BrandingWatermark,
  Discount,
  Groups,
  Inventory,
  BarChart,
  History,
  Menu as MenuIcon,
  Logout,
  ShoppingCart ,
} from "@mui/icons-material";
import { logout } from "../API/AuthUtils";

const drawerWidth = 260;

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  const navigate = useNavigate();

  const roleName = sessionStorage.getItem("role") || "ADMIN";
  const userName = sessionStorage.getItem("userName") || "Admin";
  const avatarLetter = userName?.trim()?.charAt(0)?.toUpperCase();

  const navItems = [
    { label: "Profile", path: "admin-profile", icon: <Person /> },
    { label: "Categories", path: "admin-category", icon: <Category /> },
    { label: "SubCategories", path: "admin-subcategory", icon: <Category /> },
    { label: "Brands", path: "admin-brand", icon: <BrandingWatermark /> },
    { label: "Discounts", path: "admin-discount", icon: <Discount /> },
    { label: "Sellers", path: "admin-seller", icon: <Groups /> },
    {label: "Products", path: "admin-products", icon: <ShoppingCart  />},
    { label: "Inventory", path: "admin-inventory", icon: <Inventory /> },
    { label: "Reports", path: "admin-reports", icon: <BarChart /> },
    { label: "Users", path: "admin-all-users", icon: <History /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#0D1B2A",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={toggleDrawer} sx={{ color: "white",fontWeight:"bold" }}>
              <MenuIcon />
            </IconButton>
 <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        mb: { xs: 1, sm: 0 }, 
      }}
    >
      <img
        src="/Zytra_Logo.png"
        alt="Zytra Logo"
        style={{
          width: 30,
          height: 30,
          marginRight: 8,
          verticalAlign: "middle",
          //  boxShadow: "0 2px 8px rgb(255, 255, 255)"
        }}
      />
      Zytra
    </Typography>

           
          </Box>
          <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white", fontWeight: 600}}
            >
              Admin Dashboard
            </Typography>
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
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1f2937",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 1 }}>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
              mt: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#7E57C2",
                width: 56,
                height: 56,
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {avatarLetter}
            </Avatar>

            <Typography sx={{ mt: 1, fontSize: 15, fontWeight: 600 }}>
              {roleName.replace("_", " ")}
            </Typography>
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.path}
                component={NavLink}
                to={item.path}
                onClick={toggleDrawer}
                sx={{
                  my: 0.6,
                  mx: 1,
                  borderRadius: 2,
                  color: "#d1d5db",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                  "&.active": {
                    backgroundColor: "#512DA8",
                    color: "#fff",
                    "& svg": { color: "white" },
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {item.icon}
                  <ListItemText primary={item.label} />
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
