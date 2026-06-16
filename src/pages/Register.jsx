import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CssBaseline,
} from "@mui/material";
import api from "../services/api";
import CircularProgress from "@mui/material/CircularProgress";


import toast from "react-hot-toast";
function Register() {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      toast.success("Registration Successful");
      navigate("/"); // Redirect to login
    } catch (error) {
      toast.error("Registration Failed");
    }
  };

  return (
    <>
      <CssBaseline />
      
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: 2,
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: { xs: 3, sm: 5 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Header / Branding */}
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                letterSpacing: "-0.5px",
                mb: 0.5,
              }}
            >
              StockPilot
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Create your account to get started.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={form.name}
                onChange={handleChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                sx={{ mb: 3 }}
              />

<Button
  type="submit"
  fullWidth
  variant="contained"
  size="large"
  disabled={loading}
  sx={{
    py: 1.5,
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
    "&:hover": {
      boxShadow: "0 6px 20px rgba(37, 99, 235, 0.3)",
    },
  }}
>
  {loading ? (
    <>
      <CircularProgress
        size={20}
        color="inherit"
        sx={{ mr: 1 }}
      />
      Creating Account...
    </>
  ) : (
    "Create Account"
  )}
</Button>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Register;