import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import "../style/dashboard.css";
import Logo from "../images/piggybank.png";
import Box from "@mui/material/Box";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';


import {
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  const theme = createTheme({
    typography: {
      color: "#FFFFFF"
    },
  });


  return (
    <nav>
      <ThemeProvider theme={theme}>
      {/* Render the navigation links as buttons */}

      {user ? (
        <>
          <ListItemButton component={Link} to="/dashboard"
           sx={{
            "&:hover": {
              backgroundColor: "#69B45E",
              color: "#FFFFFF",
            },
          }}>
            Dashboard
          </ListItemButton>
          <ListItemButton component={Link} to="/transactions"
           sx={{
            "&:hover": {
              backgroundColor: "#69B45E",
              color: "#FFFFFF",
            },
          }}>
            Transactions
          </ListItemButton>
          <ListItemButton component={Link} to="/budgets"
           sx={{
            "&:hover": {
              backgroundColor: "#69B45E",
              color: "#FFFFFF",
            },
          }}>
            Budgets
          </ListItemButton>
          <ListItemButton component={Link} to="/savings"
           sx={{
            "&:hover": {
              backgroundColor: "#69B45E",
              color: "#FFFFFF",
            },
          }}>
            Savings
          </ListItemButton>
          <ListItemButton component={Link} to="/reports"
           sx={{
            "&:hover": {
              backgroundColor: "#69B45E",
              color: "#FFFFFF",
            },
          }}>
            Reports
          </ListItemButton>
          <ListItemButton onClick={auth.logout}
           sx={{
            "&:hover": {
              backgroundColor: "#69B45E",
              color: "#FFFFFF",
            },
          }}> Logout </ListItemButton>
        </>
      ) : (
        <>
          <div className="nav-list">
            <Link to="/">Home</Link>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </>
      )}
      </ThemeProvider>
    </nav>
  );
};

export default Navbar;
