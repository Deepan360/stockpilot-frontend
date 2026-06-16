import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Collapse,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  
  // Controls expanding/collapsing summaries to prioritize the main data matrix table
  const [showMetrics, setShowMetrics] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    sku: "",
    reorder_level: 10,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const productData = res.data?.data || res.data || [];
      setProducts(productData);
      setFilteredProducts(productData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({ name: "", price: "", quantity: "", category: "", sku: "", reorder_level: 10 });
    setOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditId(product.id || product._id);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      quantity: product.quantity || "",
      category: product.category || "",
      sku: product.sku || "",
      reorder_level: product.reorder_level ?? 10,
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleAddProduct = async () => {
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category: formData.category,
        sku: formData.sku,
        reorder_level: Number(formData.reorder_level),
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
         toast.success(
    "Product updated successfully"
  );
      } else {
        await api.post("/products", payload);
        toast.success(
    "Product added successfully"
  );
      }

      fetchProducts();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "An error occurred while saving the product"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Delete this product permanently?");
      if (!confirmDelete) return;
      await api.delete(`/products/${id}`);
      toast.success(
    "Product deleted successfully"
  );
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "An error occurred while deleting the product"
      );
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Metrics Accumulators
  const totalProducts = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0), 0);
  const lowStockCount = products.filter((p) => Number(p.quantity) <= Number(p.reorder_level || 10)).length;
  const uniqueCategories = new Set(products.map((p) => p.category).filter(Boolean)).size;

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F8FAFC", height: "100vh", overflow: "hidden" }}>
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
        }}
      >
        <Toolbar />

        {/* High-Density Action Control Panel */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            flexWrap: "nowrap", 
            gap: 1,
            mb: 2 // Clean separation below the title track
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1E293B", letterSpacing: "-0.5px" }}>
              Items Matrix
            </Typography>
            <Chip 
              label={`${filteredProducts.length} entries`} 
              size="small" 
              sx={{ backgroundColor: "#E2E8F0", fontWeight: 600, color: "#475569", height: 20, fontSize: "11px" }} 
            />
            <Button
              size="small"
              variant="text"
              startIcon={showMetrics ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowMetrics(!showMetrics)}
              sx={{ textTransform: "none", ml: 0.5, fontWeight: 600, fontSize: "13px" }}
            >
              {showMetrics ? "Hide Insights" : "Show Insights"}
            </Button>
          </Box>
        </Box>

        {/* Collapsible Stats Bar Drawer — Extra Margin Added to Prevent Congestion */}
        <Collapse in={showMetrics} timeout="auto">
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2,mb:5,mt:0 }}>
            {[
              { label: "Total Asset Types", value: totalProducts, icon: <InventoryIcon fontSize="small" color="primary" /> },
              { label: "Net Valuation", value: `₹${inventoryValue.toLocaleString("en-IN")}`, icon: <AccountBalanceWalletIcon fontSize="small" sx={{ color: "#10B981" }} /> },
              { label: "Deficit Stock Levels", value: lowStockCount, icon: <WarningAmberIcon fontSize="small" color="error" />, isError: lowStockCount > 0 },
              { label: "Distinct Categories", value: uniqueCategories, icon: <CategoryIcon fontSize="small" sx={{ color: "#8B5CF6" }} /> },
            ].map((card, idx) => (
              <Paper key={idx} elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ backgroundColor: "#F1F5F9", p: 1, borderRadius: 1.5, display: "flex" }}>{card.icon}</Box>
                <Box>
                  <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ display: "block", fontSize: "10px", textTransform: "uppercase" }}>
                    {card.label}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: card.isError ? "error.main" : "#1E293B", lineHeight: 1.2 }}>
                    {card.value}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Collapse>

        {/* Search Bar & Action Button Row — Standardized Layout & Precise Alignment */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", // Vertically centers items along a strict baseline
            justifyContent: "space-between", 
            gap: 2, 
            mb: 2 
          }}
        >
          <TextField
            placeholder="Quick search matrix..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: { xs: "100%", sm: "280px" }, 
              "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "#FFF" } 
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
            sx={{ 
              borderRadius: 2, 
              textTransform: "none", 
              fontWeight: 600, 
              px: 3, 
              height: "40px", // Locks exact matching height line with small Textfield
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" }
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Maximized Structural Grid View Window */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            flexGrow: 1, // Dynamically force layout wrapper to ingest maximum viewport allowance
            height: "100%",
            overflowY: "auto", 
          }}
        >
          {loading ? (
            <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={36} />
            </Box>
          ) : (
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: "#F8FAFC" }}>Product Details</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: "#F8FAFC" }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: "#F8FAFC" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: "#F8FAFC" }} align="right">Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: "#F8FAFC" }} align="right">Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: "#F8FAFC" }} align="center">Reorder Target</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: "#F8FAFC" }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 12, color: "text.secondary" }}>
                      No registered assets listed within this filter matrix.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock = Number(product.quantity) <= Number(product.reorder_level || 10);
                    return (
                      <TableRow key={product.id || product._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 600, color: "#1E293B", py: 1 }}>{product.name}</TableCell>
                        <TableCell sx={{ color: "#64748B", fontFamily: "monospace", fontSize: "13px" }}>{product.sku || "-"}</TableCell>
                        <TableCell>
                          <Chip label={product.category || "General"} size="small" variant="outlined" sx={{ borderRadius: 1.5, height: 22, fontSize: "11px" }} />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>₹{Number(product.price).toLocaleString("en-IN")}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: isLowStock ? "#DC2626" : "#16A34A" }}>
                            {product.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#64748B" }}>{product.reorder_level}</TableCell>
                        <TableCell align="right" sx={{ py: 0.2 }}>
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                            <Tooltip title="Edit Profile">
                              <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(product)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Profile">
                              <IconButton size="small" color="error" onClick={() => handleDelete(product.id || product._id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Operational Flow Dialogue Backdrop Component */}
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>{editId ? "Modify Product Details" : "Register Asset Profile"}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 1.5 }}>
              <TextField fullWidth size="small" label="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ gridColumn: { sm: "span 2" } }} />
              <TextField fullWidth size="small" label="SKU String" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
              <TextField fullWidth size="small" label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <TextField fullWidth size="small" type="number" label="Unit Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
              <TextField fullWidth size="small" type="number" label="Stock Units" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
              <TextField fullWidth size="small" type="number" label="Reorder Threshold Limit" value={formData.reorder_level} onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })} sx={{ gridColumn: { sm: "span 2" } }} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleAddProduct} disabled={saving} sx={{ minWidth: 120, borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "none" }}>
              {saving ? <CircularProgress size={20} color="inherit" /> : editId ? "Update Item" : "Save Item"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Products;