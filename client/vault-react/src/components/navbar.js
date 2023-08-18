import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import "../styles/navbar/style.css";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  return (
<<<<<<< HEAD
    <div className="wrapper-menu">
      <nav className="nav-list">
        {/* always */}
        {/* only logged in */}
        {user ? (
          <>
            <Link className="menu" to="/dashboard">
              Home
            </Link>
            <Link className="menu" to="/user/:userId/transactions">
              Transactions
            </Link>
            <Link className="menu" to="/user/:userId/budgets">
              Budgets
            </Link>
            <Link className="menu" to="/user/:userId/savings">
              Savings
            </Link>
            <Link className="menu" to="/user/:userId/reports">
              Reports
            </Link>
            <Link className="menu" onClick={auth.logout}>
              Logout
            </Link>{" "}
            <Link className="menu" to="/transactions">
              Transactions_TEST
            </Link>{" "}
            <Link className="menu" to="/transaction/add">
              Transactions_TEST_ADD
            </Link>{" "}
          </>
        ) : (
          <>
            <Link className="menu" to="/">
              Home
            </Link>{" "}
            <Link className="menu" to="/login">
              Log In
            </Link>{" "}
            <Link className="menu" to="/signup">
              Signup
            </Link>
          </>
        )}
      </nav>
    </div>
=======
    <nav className="nav-list">
      {/* always */}
      {/* only logged in */}
      {user && (
        <>
          <Link to="/dashboard">Home</Link>
          <Link to="/user/:userId/transactions">Transactions</Link>
<Link to= "/budgets">Budgets</Link>
          <Link to="/savings">Savings</Link>
          <Link to="/user/:userId/reports">Reports</Link>
          <Link onClick={auth.logout}>Logout</Link>
 <Link to="/transactions">Transactions_TEST</Link>{" "}
          <Link to="/transaction/add">Transactions_TEST_ADD</Link>{" "}


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
>>>>>>> 95d772497ed7b2fb823a063452192a091e4a41d8
  );
};

export default Navbar;
