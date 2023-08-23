import "./App.css";
import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthContext from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import TransactionsList from "./components/TransactionsList.js";
import TransactionForm from "./components/TransactionForm";
import DeleteTransaction from "./components/DeleteTransaction";
import GoalsList from "./components/GoalsList";
import GoalsAndTransactions from "./components/GoalsAndTransactions";
import GoalsForm from "./components/GoalsForm";
import DeleteGoal from "./components/DeleteGoal";
import ReportList from "./components/ReportList";
import ReportForm from "./components/ReportForm";
import DeleteReport from "./components/DeleteReport";
import DrawerComponent from "./components/Drawer";
import { Container, CssBaseline, Grid } from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [finishedLoginAttempt, setFinishedLoginAttempt] = useState(false);

  const login = (token) => {
    const { sub: username, authorities: authoritiesString } = jwtDecode(token);

    const roles = authoritiesString.split(",");

    const user = {
      username,
      roles,
      token,
      hasRole(role) {
        return this.roles.includes(role);
      },
    };

    localStorage.setItem("auth-token", token);
    setUser(user);

    return user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
    window.location.href = window.location.origin;
  };

  const auth = { login, logout, user };

  const HeaderLoggedIn = () => {
    return <header>{/* Your header content for logged-in state */}</header>;
  };

  const HeaderLoggedOut = () => {
    return (
      <header>
        {/* Your header content for logged-in state */}
        <Navbar />
      </header>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      login(token);
    }
    setFinishedLoginAttempt(true);
  }, []);

  if (!finishedLoginAttempt) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <CssBaseline />

        {user ? <DrawerComponent /> : <HeaderLoggedOut />}

        {/* {user && ( // Conditionally render the DrawerComponent only when user is logged in
          <DrawerComponent />
        )} */}
        {/* <Grid item xs={9} md={9} lg={9}> */}

        <Routes>
          {/* when logged out */}

          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/signup" element={<Signup />} />
          {/* if we want to add a aboutUs page we can add this here */}

          {/* loggin in only */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/transactions"
            element={
              user ? <TransactionsList user={user} /> : <Navigate to = "/" />
            }
          />
          <Route
            path="/edit/:transactionId"
            element={user ? <TransactionForm /> : <Navigate to="/" />}
          />
          <Route
            path="/transaction/add"
            element={
              user ? <TransactionForm user={user} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/deleteTransaction/:transactionId"
            element={user ? <DeleteTransaction /> : <Navigate to="/" />}
          />

          <Route
            path="/budgets"
            element={user ? <GoalsList type="spending" /> : <Navigate to="/" />}
          />
          <Route
            path="/budgets/:goalsId"
            element={user ? <GoalsAndTransactions /> : <Navigate to="/" />}
          />
          <Route
            path="/budgets/add"
            element={user ? <GoalsForm type="spending" /> : <Navigate to="/" />}
          />
          <Route
            path="/budgets/edit/:goalsId"
            element={user ? <GoalsForm type="spending" /> : <Navigate to="/" />}
          />

          <Route
            path="/savings"
            element={user ? <GoalsList type="saving" /> : <Navigate to="/" />}
          />
          <Route
            path="savings/:goalId"
            element={user ? <GoalsAndTransactions /> : <Navigate to="/" />}
          />
          <Route
            path="/savings/edit/:goalsId"
            element={user ? <GoalsForm type="saving" /> : <Navigate to="/" />}
          />
          <Route
            path="/savings/add"
            element={user ? <GoalsForm type="saving" /> : <Navigate to="/" />}
          />

          <Route
            path="/reports"
            element={user ? <ReportList user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/report/add"
            element={user ? <ReportForm user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/deleteReport/:reportId"
            element={user ? <DeleteReport /> : <Navigate to="/" />}
          />

          {/* always */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
