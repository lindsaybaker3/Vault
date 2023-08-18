import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import "../style/dashboard.css";


const Navbar = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  const navClassName = user ? "sidebar" : "nav-list";

  return (
    <nav className={`${navClassName}`}>

      {/* always */}
      
      {/* only logged in */}
      
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link> {" "}
          <Link to="/transactions">Transactions</Link> {" "}
          <Link to="/budgets">Budgets</Link> {" "}
          <Link to="/savings">Savings</Link> {" "}
          <Link to="/user/:userId/reports">Reports</Link> {" "}
          <Link onClick={auth.logout}>Logout</Link>
        </>
      ) : (
        <>
          <Link to="/">Home</Link> {" "}
          <Link to="/login">Log In</Link> {" "} 
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
