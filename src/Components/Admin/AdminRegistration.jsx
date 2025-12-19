import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const registrationSchema = {
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
    address: {
      label: "Address",
      required: true,
      pattern: /^.{5,100}$/,
      error: "Address must be 5–100 characters long.",
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
    adminName: {
      label: "Admin Username",
      required: true,
      pattern: /^[A-Za-z0-9@._-]{4,20}$/,
      error: "Admin username must be 4–20 characters, no spaces.",
    },
    password: {
      label: "Password",
      required: true,
      pattern:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      error:
        "Password must contain uppercase, lowercase, number & special character.",
    },
  };

  const initialState = Object.keys(registrationSchema).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const field = registrationSchema[name];

    if (field.required && !value.trim()) {
      return `${field.label} is required.`;
    }
    if (field.pattern && !field.pattern.test(value)) {
      return field.error;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let tempErrors = {};
    let hasError = false;

    Object.keys(registrationSchema).forEach((key) => {
      const err = validateField(key, formData[key]);
      tempErrors[key] = err;
      if (err) hasError = true;
    });

    setErrors(tempErrors);

    if (!hasError) {
      console.log("Payload Submitted => ", formData);
      alert("Registration Successful!");
      navigate("/admin-login");
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
        <Box
          sx={{
            width: "100%",
            maxWidth: 850,
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg,#1e293b,#0f172a)",
            border: "1px solid #1f2937",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#e5e7eb", fontWeight: 800, mb: 1 }}
          >
            Admin Registration
          </Typography>

          <Grid item xs={12} sx={{ mb:3}}>
  <Typography align="center" sx={{ color: "#9ca3af"}}>
    Already have an account?{" "}
    <Button
      variant="text"
      onClick={() => navigate("/admin-login")}
      sx={{
        color: "#e5e7eb",
        fontWeight: 600,
        textTransform: "none",
        p: 0,
        minWidth: "auto",
      }}
    >
      Login
    </Button>
  </Typography>
</Grid>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              {Object.keys(registrationSchema).map((fieldKey) => {
                const field = registrationSchema[fieldKey];
                const isPassword = fieldKey === "password";

                return (
                  <Grid item xs={12} sm={6} key={fieldKey}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={fieldKey}
                      type={
                        isPassword
                          ? showPassword
                            ? "text"
                            : "password"
                          : "text"
                      }
                      value={formData[fieldKey]}
                      onChange={handleChange}
                      error={Boolean(errors[fieldKey])}
                      helperText={errors[fieldKey] || ""}
                      InputLabelProps={{ style: { color: "#9ca3af" } }}
                      InputProps={{
                        style: { color: "#e5e7eb" },
                        endAdornment: isPassword ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPassword((prev) => !prev)
                              }
                              sx={{ color: "#9ca3af" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#374151" },
                          "&:hover fieldset": {
                            borderColor: "#6366f1",
                          },
                        },
                        "& .MuiFormHelperText-root": {
                          color: "#fca5a5",
                        },
                      }}
                    />
                  </Grid>
                );
              })}

<Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
  <Box sx={{ width: "100%", maxWidth: 360 }}>
    <Button
      fullWidth
      size="large"
      type="submit"
      variant="contained"
      sx={{
        mt: 2,
        py: 1.3,
        fontWeight: 700,
        background: "linear-gradient(135deg,#6366f1,#22c55e)",
      }}
    >
      Register
    </Button>
  </Box>
</Grid>



            </Grid>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminRegistration;
