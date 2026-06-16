import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CssBaseline,
  Toolbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Chip,
  LinearProgress,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/products");
      const data = res.data?.data || res.data || [];
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Metrics Calculations
  const totalProducts = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0), 0);
  const lowStockCount = products.filter((p) => Number(p.quantity) <= Number(p.reorder_level || 10)).length;
  const totalCategories = new Set(products.map((p) => p.category).filter(Boolean)).size;

  const healthScore = totalProducts > 0
    ? Math.round((products.filter((p) => Number(p.quantity) > Number(p.reorder_level || 10)).length / totalProducts) * 100)
    : 0;

  // Modernized Matrix Setup
  const stats = [
    { title: "Total Products", value: totalProducts, icon: <InventoryIcon sx={{ color: "#3B82F6" }} />, color: "#3B82F6" },
    { title: "Inventory Value", value: `₹${inventoryValue.toLocaleString("en-IN")}`, icon: <AccountBalanceWalletIcon sx={{ color: "#10B981" }} />, color: "#10B981" },
    { title: "Low Stock Alerts", value: lowStockCount, icon: <WarningAmberIcon sx={{ color: "#EF4444" }} />, color: "#EF4444", isWarning: lowStockCount > 0 },
    { title: "Categories", value: totalCategories, icon: <CategoryIcon sx={{ color: "#8B5CF6" }} />, color: "#8B5CF6" },
  ];

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F8FAFC", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - 260px)` },
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Toolbar />

        {/* Header Track */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1E293B", letterSpacing: "-0.5px" }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Smart Inventory Intelligence Platform
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 2 }}>
            
            {/* KPI Cards Grid Component */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2.5 }}>
              {stats.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderLeft: `4px solid ${item.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px 0 rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: item.isWarning ? "#EF4444" : "#1E293B", mt: 0.5 }}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: `${item.color}10`, p: 1.2, borderRadius: 2, display: "flex" }}>
                    {item.icon}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Split Data Layout Panel */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              
              {/* Left Column: Inventory Metrics & Health Profile */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1E293B", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUpIcon fontSize="small" color="primary" /> Inventory Health Index
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      sx={{
                        color: healthScore >= 90 ? "#10B981" : healthScore >= 70 ? "#F59E0B" : "#EF4444",
                      }}
                    >
                      {healthScore}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Optimal Operational Standard
                    </Typography>
                  </Box>

                  <LinearProgress 
                    variant="determinate" 
                    value={healthScore} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      backgroundColor: "#E2E8F0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: healthScore >= 90 ? "#10B981" : healthScore >= 70 ? "#F59E0B" : "#EF4444",
                      },
                      mb: 2
                    }} 
                  />
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Aggregated real-time health summary reflecting standard asset quantities maintained safely above designated baseline reorder threshold targets.
                  </Typography>
                </Paper>

                {/* Stock Alert Warning Matrix Container */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1E293B", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningAmberIcon fontSize="small" sx={{ color: "#EF4444" }} /> Critical Stock Deficit Register
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {products.filter((p) => Number(p.quantity) <= Number(p.reorder_level || 10)).length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                        All tracked profiles match or exceed safety limits.
                      </Typography>
                    ) : (
                      products
                        .filter((p) => Number(p.quantity) <= Number(p.reorder_level || 10))
                        .slice(0, 4)
                        .map((product, idx) => (
                          <Box
                            key={product.id || product._id || idx}
                            sx={{
                              py: 1.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #F1F5F9",
                              "&:last-child": { borderBottom: 0 }
                            }}
                          >
                            <Box>
                              <Typography variant="body2" fontWeight={600} sx={{ color: "#1E293B" }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Threshold: {product.reorder_level || 10} units
                              </Typography>
                            </Box>
                            <Chip 
                              label={`${product.quantity} left`} 
                              size="small" 
                              sx={{ backgroundColor: "#FEE2E2", color: "#EF4444", fontWeight: 700, fontSize: "11px", borderRadius: 1.5 }} 
                            />
                          </Box>
                        ))
                    )}
                  </Box>
                </Paper>
              </Box>

              {/* Right Column: Financial Assets Valuation Breakdown */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1E293B", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <AccountBalanceWalletIcon fontSize="small" sx={{ color: "#10B981" }} /> Top Valuation Capital Pools
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {[...products]
                    .sort((a, b) => (Number(b.price || 0) * Number(b.quantity || 0)) - (Number(a.price || 0) * Number(a.quantity || 0)))
                    .slice(0, 6)
                    .map((product, idx) => {
                      const assetValue = Number(product.price || 0) * Number(product.quantity || 0);
                      return (
                        <Box
                          key={product.id || product._id || idx}
                          sx={{
                            py: 1.6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #F1F5F9",
                            "&:last-child": { borderBottom: 0 }
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: "#1E293B" }}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Units Packed: {product.quantity} × ₹{Number(product.price).toLocaleString("en-IN")}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={700} sx={{ color: "#10B981" }}>
                            ₹{assetValue.toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                      );
                    })}
                </Box>
              </Paper>

            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;