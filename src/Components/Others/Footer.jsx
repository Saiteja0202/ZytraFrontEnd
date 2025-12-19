import React from "react";
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0D1B2A",
        color: "white",
        pt: 6,
        pb: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={10} justifyContent="center">
          {/* Top sections */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Get to Know Us
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              About Zytra
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Careers
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Press Releases
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Zytra Science
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Connect with Us
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Facebook
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Twitter
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Instagram
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Make Money with Us
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Sell on Zytra
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Sell under Zytra Accelerator
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Protect and Build Your Brand
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Zytra Global Selling
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Supply to Zytra
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Become an Affiliate
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Fulfilment by Zytra
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Advertise Your Products
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Let Us Help You
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Your Account
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Returns Centre
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Recalls and Product Safety Alerts
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              100% Purchase Protection
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" mb={0.5}>
              Zytra App Download
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Help
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "#2e3b4e" }} />

      

        <Box
          mt={6}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          sx={{ color: "grey.400" }}
        >
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl
              size="small"
              sx={{ minWidth: 120, backgroundColor: "#1c2a48", borderRadius: 1 }}
            >
              <Select
                defaultValue="en"
                sx={{ color: "white" }}
                MenuProps={{
                  PaperProps: { sx: { backgroundColor: "#1c2a48", color: "white" } },
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 120, backgroundColor: "#1c2a48", borderRadius: 1 }}
            >
              <Select
                defaultValue="in"
                sx={{ color: "white" }}
                MenuProps={{
                  PaperProps: { sx: { backgroundColor: "#1c2a48", color: "white" } },
                }}
              >
                <MenuItem value="in">India</MenuItem>
                <MenuItem value="us">United States</MenuItem>
                <MenuItem value="uk">United Kingdom</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Typography variant="body2" fontSize={14} whiteSpace="nowrap">
            &copy; 1234-2025, Zytra.com, Inc. or its affiliates
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
