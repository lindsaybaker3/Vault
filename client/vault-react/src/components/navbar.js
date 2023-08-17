import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  return (
    <nav className="nav-list">
      {/* always */}
      
      {/* only logged in */}
      {user && (
        <>
          <Link to="/dashboard">Home</Link>
          <Link to="/user/:userId/transactions">Transactions</Link>
          <Link to= "/user/:userId/budgets">Budgets</Link>
          <Link to="/user/:userId/savings">Savings</Link>
          <Link to="/user/:userId/reports">Reports</Link>
          <Link onClick={auth.logout}>Logout</Link>

        </>
      )}
      {/* only logged out */}
      {!user && (
        <>
          <Link to="/">Home</Link> {" "}
          <Link to="/login">Log In</Link> <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
