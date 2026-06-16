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
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import api from "../services/api";
import toast from "react-hot-toast";
function Login() {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await api.post(
      "/auth/login",
      form
    );

    toast.success("Login Successful");
    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    navigate("/dashboard");

  } catch (err) {
    toast.error("Login Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* CssBaseline kicks out browser defaults and normalizes styles across devices */}
      <CssBaseline /> 
      
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: 2, // 16px padding around the viewport
        }}
      >
        {/* Container automatically handles responsive max-widths based on breakpoints */}
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: { xs: 3, sm: 5 }, // 24px padding on mobile, 40px on tablet/desktop
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3, // Premium rounded corners
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)", // Trendy glassmorphism effect
            }}
          >
            {/* StockPilot Header branding */}
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
              Welcome back! Please enter your details.
            </Typography>

            <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={handleChange}
                // Setting input text size to 16px ensures mobile browsers won't auto-zoom
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
                autoComplete="current-password"
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
    boxShadow:
      "0 4px 12px rgba(37, 99, 235, 0.2)",
    "&:hover": {
      boxShadow:
        "0 6px 20px rgba(37, 99, 235, 0.3)",
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
      Signing In...
    </>
  ) : (
    "Sign In"
  )}
</Button>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Register
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

export default Login;