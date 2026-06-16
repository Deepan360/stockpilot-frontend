import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 260;

function Navbar({ onMenuClick }) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        // Keeps the navbar securely layered over other content
        zIndex: theme.zIndex.drawer + 1, 
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
        {/* Left Side: Hamburger Menu & Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              color: "#64748B",
              display: { sm: "none" }, // Only visible on mobile viewports
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              color: "#1E293B",
              fontSize: { xs: "18px", sm: "20px" },
            }}
          >
            
          </Typography>
        </Box>

        {/* Right Side: Admin User Info Profile block */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              fontWeight: 500,
              display: { xs: "none", sm: "block" }, // Hides username text on ultra-small mobile screens
            }}
          >
            Welcome, Admin
          </Typography>
          
          <Avatar
            alt="Admin User"
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "primary.main",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.15)",
            }}
          >
            AD
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;