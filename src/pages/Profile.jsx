import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Toolbar,
  Grid,
  Button,
  Avatar,
  Divider,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Iconography Additions (With Cleaned-Up, Failure-Proof Import Paths)
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail"; 
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"; 
import DnsIcon from "@mui/icons-material/Dns";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Failed to sync profile calculation matrices:", error);
    }
  };

  // Metric Computations
  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category).filter(Boolean)).size;
  const inventoryValue = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0), 0);
  const lowStockItems = products.filter((p) => Number(p.quantity) <= Number(p.reorder_level || 10)).length;

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  toast.success("Logged out successfully");

  navigate("/");
};

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F8FAFC", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - 260px)` },
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Toolbar />

        {/* Outer Constrained Layout Center Wrapper */}
        <Box sx={{ maxWidth: "900px", width: "100%", mx: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          
          {/* Header Title Accent */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1E293B", letterSpacing: "-0.5px" }}>
              User Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Review system privileges, active parameters, and core inventory performance telemetry
            </Typography>
          </Box>

          {/* Module 1: Unified Identity & Credential Matrix Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 4, mb: 3 }}>
              {/* Profile Avatar Spot */}
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: "#3B82F6",
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.15)",
                }}
              >
                {(user?.name || "A").charAt(0).toUpperCase()}
              </Avatar>

              {/* Quick Text Summary */}
              <Box sx={{ textAlign: { xs: "center", sm: "left" }, flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: "#1E293B", lineHeight: 1.2 }}>
                  {user?.name || "Inventory Admin"}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={700} sx={{ mt: 0.5 }}>
                  {user?.role || "Inventory Manager"}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Status: Session Verified &bull; StockPilot Cloud Node
                </Typography>
              </Box>

              {/* Session Termination Control */}
              <Button
                variant="contained"
                color="error"
                disableElevation
                startIcon={<ExitToAppIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  backgroundColor: "#EF4444",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { backgroundColor: "#DC2626" },
                }}
              >
                Sign Out
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#F1F5F9" }} />

            {/* Account Information Details Grid */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, textTransform: "uppercase" }}>
                    <PersonIcon fontSize="inherit" color="action" /> Account Name
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="#1E293B">
                    {user?.name || "Inventory Admin"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, textTransform: "uppercase" }}>
                    <MailIcon fontSize="inherit" color="action" /> Email Endpoint
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="#1E293B">
                    {user?.email || "admin@stockpilot.com"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, textTransform: "uppercase" }}>
                    <AdminPanelSettingsIcon fontSize="inherit" color="action" /> Access Group
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="#1E293B">
                    {user?.role || "Inventory Manager"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, textTransform: "uppercase" }}>
                    <DnsIcon fontSize="inherit" color="action" /> Routing Platform
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="#1E293B">
                    StockPilot Core Engine v2.0
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Module 2: System Operational Scope Cards Grid */}
          <Box>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#475569", mb: 2, px: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Operational Scope KPIs
            </Typography>
            
            <Grid container spacing={3}>
              {/* Products Card */}
              <Grid item xs={12} sm={6} lg={3}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>Products</Typography>
                    <Box sx={{ backgroundColor: "#EFF6FF", p: 0.8, borderRadius: 1.5, display: "flex", color: "#3B82F6" }}>
                      <InventoryIcon fontSize="small" />
                    </Box>
                  </Box>
                  <Typography variant="h5" fontWeight={800} color="#1E293B">{totalProducts}</Typography>
                </Paper>
              </Grid>

              {/* Categories Card */}
              <Grid item xs={12} sm={6} lg={3}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>Categories</Typography>
                    <Box sx={{ backgroundColor: "#F5F3FF", p: 0.8, borderRadius: 1.5, display: "flex", color: "#8B5CF6" }}>
                      <CategoryIcon fontSize="small" />
                    </Box>
                  </Box>
                  <Typography variant="h5" fontWeight={800} color="#1E293B">{totalCategories}</Typography>
                </Paper>
              </Grid>

              {/* Financial Assets Valuation */}
              <Grid item xs={12} sm={6} lg={3}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>Net Valuation</Typography>
                    <Box sx={{ backgroundColor: "#ECFDF5", p: 0.8, borderRadius: 1.5, display: "flex", color: "#10B981" }}>
                      <AccountBalanceWalletIcon fontSize="small" />
                    </Box>
                  </Box>
                  <Typography variant="h5" fontWeight={800} color="#10B981">
                    ₹{inventoryValue.toLocaleString("en-IN")}
                  </Typography>
                </Paper>
              </Grid>

              {/* Critical Level Triggers */}
              <Grid item xs={12} sm={6} lg={3}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>Stock Alerts</Typography>
                    <Box sx={{ backgroundColor: "#FEF2F2", p: 0.8, borderRadius: 1.5, display: "flex", color: "#EF4444" }}>
                      <WarningAmberIcon fontSize="small" />
                    </Box>
                  </Box>
                  <Typography variant="h5" fontWeight={800} color={lowStockItems > 0 ? "#EF4444" : "#1E293B"}>{lowStockItems}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;