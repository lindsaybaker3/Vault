import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const NavSideList = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  return (
    <nav className="sidebar">

        {/* only logged in */}
        {user && (
        <>
        <div className="sidebar">
            <a className="active" href="#home">
                <Link to="/dashboard">Home</Link>
            </a>        
            <a href="#transactions">
                <Link to="/user/:userId/transactions">Transactions</Link>
            </a>
            <a href="#budgets">
                <Link to= "/user/:userId/budgets">Budgets</Link>
            </a>
            <a href="#savings">
                <Link to="/user/:userId/savings">Savings</Link>
            </a>
            <a href="#reports">
                <Link to="/user/:userId/reports">Reports</Link>
            </a>
            <a href="#logout">
                <Link onClick={auth.logout}>Logout</Link>
            </a>
        </div>

        {/*-- Page content --*/}
        <div class="content">
            {/* ... */}
        </div>

        </>
        )}
    </nav>

    );
};

export default NavSideList;



