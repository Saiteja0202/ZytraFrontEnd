import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../API/UserAPIs";

const UserRegistration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const userSchema = {
    firstName: {
      label: "First Name",
      required: true,
      pattern: /^[A-Za-z]{2,30}$/,
      error: "First name must contain only letters (2–30 characters).",
    },
    lastName: {
      label: "Last Name",
      required: true,
      pattern: /^[A-Za-z]{2,30}$/,
      error: "Last name must contain only letters (2–30 characters).",
    },
    phoneNumber: {
      label: "Phone Number",
      required: true,
      pattern: /^[0-9]{10}$/,
      error: "Phone number must be exactly 10 digits.",
    },
    email: {
      label: "Email",
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: "Enter a valid email address.",
    },
    doorNumber: {
      label: "Door Number",
      required: true,
      pattern: /^[A-Za-z0-9]{1,10}$/,
      error: "Door number must be alphanumeric (max 10 chars).",
    },
    street: {
      label: "Street",
      required: true,
      pattern: /^.{3,40}$/,
      error: "Street must be 3–40 characters long.",
    },
    village: {
      label: "Village",
      required: true,
      pattern: /^[A-Za-z ]{2,40}$/,
      error: "Village must contain only letters.",
    },
    landMark: {
      label: "Landmark",
      required: true,
      pattern: /^.{3,50}$/,
      error: "Landmark must be 3–50 characters long.",
    },
    city: {
      label: "City",
      required: true,
      pattern: /^[A-Za-z ]{2,40}$/,
      error: "City must contain only letters.",
    },
    district: {
      label: "District",
      required: true,
      pattern: /^[A-Za-z ]{2,40}$/,
      error: "District must contain only letters.",
    },
    postalCode: {
      label: "Postal Code",
      required: true,
      pattern: /^[0-9]{6}$/,
      error: "Postal code must be exactly 6 digits.",
    },
    state: {
      label: "State",
      required: true,
      pattern: /^[A-Za-z ]{2,40}$/,
      error: "State must contain only letters.",
    },
    country: {
      label: "Country",
      required: true,
      pattern: /^[A-Za-z ]{2,40}$/,
      error: "Country must contain only letters.",
    },
    userName: {
      label: "Username",
      required: true,
      pattern: /^[A-Za-z0-9@._-]{4,25}$/,
      error: "Username must be 4–25 chars (letters, numbers, @ . _ -).",
    },
    password: {
      label: "Password",
      required: true,
      pattern:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      error:
        "Password must include uppercase, lowercase, number, and special character.",
    },
  };

  const initialState = Object.keys(userSchema).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    const field = userSchema[name];

    if (field.required && !value.trim()) return `${field.label} is required.`;
    if (field.pattern && !field.pattern.test(value)) return field.error;

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    setApiError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};
    let hasError = false;

    Object.keys(userSchema).forEach((key) => {
      const err = validateField(key, formData[key]);
      tempErrors[key] = err;
      if (err) hasError = true;
    });

    setErrors(tempErrors);

    if (hasError) return;

    try {
      setLoading(true);

      await registerUser(formData);


      alert("🎉 Registration Successful!");
      navigate("/user-login");

    } catch (error) {
      console.error(error);

      setApiError(
        error?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 3 : 5,
            borderRadius: 3,
            width: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            sx={{ color: "#183c86", fontWeight: "bold" }}
          >
            User Registration
          </Typography>

          {apiError && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {apiError}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {Object.keys(userSchema).map((fieldKey) => {
                const field = userSchema[fieldKey];

                return (
                  <Grid item xs={12} sm={6} key={fieldKey}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={fieldKey}
                      type={fieldKey === "password" ? "password" : "text"}
                      value={formData[fieldKey]}
                      onChange={handleChange}
                      error={Boolean(errors[fieldKey])}
                      helperText={errors[fieldKey] || ""}
                    />
                  </Grid>
                );
              })}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register User"}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link
              component="button"
              underline="hover"
              onClick={() => navigate("/user-login")}
            >
              Login here
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserRegistration;
