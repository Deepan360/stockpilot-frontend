import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Toolbar,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
} from "@mui/material";


import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined"; 
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Alerts() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const productData = res.data?.data || res.data || [];
      setProducts(productData);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derive alert status lists smoothly on the client
  const alerts = products.filter(
    (p) => Number(p.quantity) <= Number(p.reorder_level || 10)
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - 260px)` },
          boxSizing: "border-box",
        }}
      >
        <Toolbar />

        {/* Page Header Title */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
          <NotificationsActiveIcon color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E293B" }}>
              Stock Alerts Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time monitoring for items hitting critical reorder boundaries.
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ py: 12, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={40} />
          </Box>
        ) : alerts.length === 0 ? (
          /* Premium Empty "All Clear" State */
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              border: "1px dashed #CBD5E1",
              backgroundColor: "#F0FDF4",
              textAlign: "center",
            }}
          >
            <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 56, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#14532D", mb: 0.5 }}>
              All Inventory Levels Healthy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No products are currently under reorder thresholds. Great job!
            </Typography>
          </Paper>
        ) : (
          /* Alerts Feed Layout wrapper */
          <Stack spacing={2.5}>
            {alerts.map((product) => {
              // Critical if stock is 5 or less, otherwise standard warning
              const isCritical = Number(product.quantity) <= 5;
              
              const statusColor = isCritical ? "error" : "warning";
              const borderAccent = isCritical ? "1px solid #FCA5A5" : "1px solid #FDE047";
              const bgAccent = isCritical ? "#FEF2F2" : "#FFFBEB";

              return (
                <Paper
                  key={product.id || product._id}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 4,
                    border: borderAccent,
                    backgroundColor: bgAccent,
                    transition: "transform 0.15s ease",
                    "&:hover": {
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 2,
                    }}
                  >
                    {/* Left Meta Column: Name & SKU */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        {isCritical ? (
                          <ErrorOutlineIcon color="error" sx={{ fontSize: 28 }} />
                        ) : (
                          <WarningAmberIcon color="warning" sx={{ fontSize: 28 }} />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B", fontFamily: "monospace", mt: 0.5 }}>
                          SKU: {product.sku || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Divider for cleaner stacked mobile sizing layout */}
                    <Divider sx={{ display: { xs: "block", sm: "none" }, width: "100%" }} />

                    {/* Right Numeric Quantities Metrics block */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: { xs: "100%", sm: "auto" },
                        gap: { sm: 4 },
                      }}
                    >
                      <Box sx={{ textAlign: { sm: "right" } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Current Stock:{" "}
                          <Box component="span" sx={{ fontWeight: 700, color: `${statusColor}.main` }}>
                            {product.quantity}
                          </Box>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                          Reorder Threshold: {product.reorder_level || 10}
                        </Typography>
                      </Box>

                      <Chip
                        color={statusColor}
                        label={isCritical ? "Critical Shortage" : "Low Stock"}
                        icon={isCritical ? <ErrorOutlineIcon /> : <WarningAmberIcon />}
                        sx={{
                          fontWeight: 700,
                          borderRadius: 2,
                          px: 1,
                          textTransform: "uppercase",
                          fontSize: "11px",
                          letterSpacing: "0.5px",
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default Alerts;