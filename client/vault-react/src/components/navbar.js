import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import "../style/dashboard.css";

import {
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  return (
    <nav>
      {/* Render the navigation links as buttons */}
      {user ? (
        <>
          <ListItemButton component={Link} to="/dashboard">
            Dashboard
          </ListItemButton>
          <ListItemButton component={Link} to="/transactions">
            Transactions
          </ListItemButton>
          <ListItemButton component={Link} to="/budgets">
            Budgets
          </ListItemButton>
          <ListItemButton component={Link} to="/savings">
            Savings
          </ListItemButton>
          <ListItemButton component={Link} to="/reports">
            Reports
          </ListItemButton>
          <ListItemButton onClick={auth.logout}> Logout </ListItemButton>
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
    </nav>
  );
};

export default Navbar;
