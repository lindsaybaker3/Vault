import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  return (
    <nav className="nav-list">
      {/* always */}
      <Link to="/">Home</Link> <Link to="/questions/all">Questions</Link>{" "}
      <Link to="/budgets"> Budges</Link>
      <Link to="/savings">Savings</Link>
      {/* only logged in */}
      {user && (
        <>
          {/* THIS IS THE CORRECT ROUT FOR ADD /questions/add */}
          <Link to="/questions/add">Ask Question</Link>{" "}
          <Link onClick={auth.logout}>Logout</Link>{" "}
          <Link to="/transactions">Transactions</Link>{" "}
          <Link to="/transaction/add">Transaction Add</Link>{" "}
        </>
      )}
      {/* only logged out */}
      {!user && (
        <>
          <Link to="/login">Log In</Link> <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
