import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  useTheme,
  useMediaQuery
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
// Modern dashboard icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const drawerWidth = 260;

function Sidebar({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  // Defined navigation links with text, destination path, and matching icons
const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    text: "Inventory",
    path: "/products",
    icon: <Inventory2Icon />,
  },
  {
    text: "Stock Alerts",
    path: "/alerts",
    icon: <WarningAmberIcon />,
  },
  {
    text: "Analytics",
    path: "/analytics",
    icon: <AnalyticsIcon />,
  },
  {
    text: "Profile",
    path: "/profile",
    icon: <PersonIcon />,
  },
];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose(); // Auto-close drawer overlay upon mobile selection
  };
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};
  const drawerContent = (
    <Box sx={{ height: "100%", backgroundColor: "#0F172A", color: "#94A3B8" }}>
      {/* Sidebar Header / Logo branding */}
<Toolbar
  sx={{
    px: 3,
    py: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  }}
>
  <Typography
    variant="h5"
    sx={{
      fontWeight: 800,
      color: "#FFFFFF",
    }}
  >
    StockPilot 
  </Typography>

  <Typography
    variant="caption"
    sx={{
      color: "#64748B",
      mt: 0.5,
    }}
  >
    Inventory Intelligence
  </Typography>
</Toolbar>

      {/* Navigation Links */}
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? "rgba(37, 99, 235, 0.15)" : "transparent",
                  color: isActive ? "#3B82F6" : "#94A3B8",
                  "&:hover": {
                    backgroundColor: isActive ? "rgba(37, 99, 235, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "#3B82F6" : "#F8FAFC",
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "#3B82F6" : "#F8FAFC",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "#3B82F6" : "#64748B",
                    transition: "color 0.2s",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "15px",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer Slide-out variant */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent layout variant */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #1E293B",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;