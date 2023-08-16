import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import jwtDecode from 'jwt-decode';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  redirect,
  useLocation,
} from "react-router-dom";

function App() {
  const[transactions, setTransactions] = useState([])
  const[goals, setGoals] = useState([])
  const[user, setUser] = useState(null)

   const login = (token) => {
    
    const { sub: username, authorities: authoritiesString } = jwtDecode(token);
  
    const roles = authoritiesString.split(',');
  
    const user = {
      username,
      roles,
      token,
      hasRole(role) {
        return this.roles.includes(role);
      }
    };

    localStorage.setItem("auth-token", token)
    setUser(user);

    return user;
  };

 const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token")
  }

  const auth = {login, logout,user}

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if(token){
      login(token)
    }
  }, [])

  return (
   <AuthContext.Provider value = {auth}>

    <BrowserRouter>
      <h1> Welcome to Vault! </h1>
      <Nav />

      <Routes>
        {/* when logged out */}
        <Route path = "/" element = {<Landing />} />
        <Route path = "/login" element = {user ? <Navigate to = "/dashboard"/> : <Login /> } />
        <Route path="/signup" element={<Signup />} />
        {/* if we want to add a aboutUs page we can add this here */}
        

        {/* loggin in only */}
        <Route path = "/dashboard" element = {<Dashboard />} />
        <Route path = "/user/:userId/transactions" element = {user ? <TransactionsList/> : <Navigate to = "/"/>} />
        <Route path = "/user/:userId/transaction/:transactionId/edit" element = {user ? <TransactionForm /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/transaction/add" element = {user ? <TransactionForm /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/transaction/delete" element = {user ? <DeleteTransaction /> : <Navigate to = "/"/>}/>


        <Route path = "/user/:userId/budgets" element = {user ? <GoalsList /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/budgets/:goalId" element = {user ? <GoalsAndTransactions /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/budgets/add" element = {user ? <GoalsForm /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/budgets/delete" element = {user ? <DeleteGoal /> : <Navigate to = "/"/>}/>
        {/* the budgets and savings are using the same table in the backend, do they just use the same forms in the Front end? */}

        <Route path = "/user/:userId/savings" element = {user ? <GoalsList /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/savings/:goalId" element = {user ? <GoalsAndTransactions /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/savings/add" element = {user ? <GoalsForm /> : <Navigate to = "/"/>}/>
        <Route path = "/user/:userId/savings/delete" element = {user ? <DeleteGoal /> : <Navigate to = "/"/>}/>


        <Route path = "/user/:userId/reports" element = {user ? <ReportList /> : <Navigate to = "/"/>}/>


        {/* always */}
        <Route path = "*" element = {<NotFound />} />
      </Routes>

    
      
    </BrowserRouter>

    </AuthContext.Provider>
  );
}

export default App;
