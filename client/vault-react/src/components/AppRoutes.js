import "../style/dashboard.css";
import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import NavSideList from "./NavSideList";





import Landing from "./Landing";
import Login from "./Login";
import NotFound from "./NotFound";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import TransactionsList from "./TransactionsList.js";
import TransactionForm from "./TransactionForm";
import DeleteTransaction from "./DeleteTransaction";
import GoalsList from "./GoalsList";
import GoalsAndTransactions from "./GoalsAndTransactions";
import GoalsForm from "./GoalsForm";
import DeleteGoal from "./DeleteGoal";
import ReportList from "./ReportList";


const AppRoutes = () => {

    {
    const auth = useContext(AuthContext);
    const user = auth.user;
  
    return (
   
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
          {/* <Route
            path="/transactions"
            element={user ? <TransactionsList /> : <Navigate to="/" />}
          /> */}
          <Route
            path="/transactions"
            element={user ? <TransactionsList /> : <Navigate to="/" />}
          />

          <Route
            path="/edit/:transactionId"
            element={user ? <TransactionForm /> : <Navigate to="/" />}
          />
          <Route
            path="/transaction/add"
            element={user ? <TransactionForm /> : <Navigate to="/" />}
          />
          <Route
            path="delete/:transactionId"
            element={user ? <DeleteTransaction /> : <Navigate to="/" />}
          />

          <Route
            path="/budgets"
            element={user ? <GoalsList /> : <Navigate to="/" />}
          />
          <Route
            path="/budgets/:goalsId"
            element={user ? <GoalsAndTransactions /> : <Navigate to="/" />}
          />
          <Route
            path="/budgets/add"
            element={user ? <GoalsForm /> : <Navigate to="/" />}
          />
          <Route
            path="edit/:budgetsId"
            element={user ? <GoalsForm /> : <Navigate to="/" />}
            />
          <Route
            path="delete/:budgetsId"
            element={user ? <DeleteGoal /> : <Navigate to="/" />}
          />
          {/* the budgets and savings are using the same table in the backend, do they just use the same forms in the Front end? */}

          <Route
            path="/user/:userId/savings"
            element={user ? <GoalsList /> : <Navigate to="/" />}
          />
          <Route
            path="/user/:userId/savings/:goalId"
            element={user ? <GoalsAndTransactions /> : <Navigate to="/" />}
          />
          <Route
            path="/user/:userId/savings/add"
            element={user ? <GoalsForm /> : <Navigate to="/" />}
          />
          <Route
            path="/user/:userId/savings/delete"
            element={user ? <DeleteGoal /> : <Navigate to="/" />}
          />

          <Route
            path="/user/:userId/reports"
            element={user ? <ReportList /> : <Navigate to="/" />}
          />

          {/* always */}
          <Route path="*" element={<NotFound />} />
    </Routes>


    );
    };
};

export default AppRoutes;