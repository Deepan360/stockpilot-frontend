import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Box,
  Paper,
  Typography,
  Toolbar,
  CircularProgress,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Analytics() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Failed to load analytics engine data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Modernized Grouping with Fallbacks
  const chartData = Object.values(
    products.reduce((acc, product) => {
      const categoryName = product.category?.trim() ? product.category : "General";
      const value = Number(product.price || 0) * Number(product.quantity || 0);

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
        };
      }
      acc[categoryName].value += value;
      return acc;
    }, {})
  ).filter((item) => item.value > 0); // Ignore categories with zero commercial valuation

  // Custom design palette synchronized with dashboard views
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#64748B"];

  // Custom tooltips styling to match the system theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={4}
          sx={{
            p: 1.5,
            border: "1px solid #E2E8F0",
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(4px)",
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", textTransform: "uppercase" }}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2" fontWeight={800} sx={{ color: "#1E293B", mt: 0.5 }}>
            ₹{payload[0].value.toLocaleString("en-IN")}
          </Typography>
        </Paper>
      );
    }
    return null;
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

        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1E293B", letterSpacing: "-0.5px" }}>
            Data Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Visual distribution profiles and asset breakdown statistics
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Box sx={{ pb: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 3,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1E293B", mb: 4, display: "flex", alignItems: "center", gap: 1 }}>
                <QueryStatsIcon fontSize="small" color="primary" /> Capital Allocation by Asset Category
              </Typography>

              {chartData.length === 0 ? (
                <Box sx={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    No asset breakdown valuation matrices available.
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Add items with real values inside the Products pane to construct indicators.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ width: "100%", height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={90} // Added inner radius transformation to make it a beautiful donut chart
                        outerRadius={135}
                        paddingAngle={3} // Clean geometric slice spacing separators
                        minAngle={5}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            style={{ outline: "none" }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign={isMobile ? "bottom" : "middle"} 
                        align={isMobile ? "center" : "right"}
                        layout={isMobile ? "horizontal" : "vertical"}
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{
                          paddingLeft: isMobile ? 0 : "24px",
                          paddingTop: isMobile ? "16px" : 0,
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#475569"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Analytics;