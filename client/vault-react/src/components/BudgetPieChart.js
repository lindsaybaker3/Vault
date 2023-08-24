import React from 'react';
import { PieChart, Pie, Sector, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useContext, useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import AuthContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const BudgetPieChart = () => {

    const auth = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const theme = useTheme();
    const navigate = useNavigate();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FFA500'];

  const loadTransactions = () => {
    fetch("http://localhost:8080/api/vault/transactions", {
    headers: {
        Authorization: "Bearer " + auth.user.token,
    },
    })
    .then(response => response.json())
    .then(payload => {
        console.log("Fetched transactions:", payload);
        setTransactions(payload);
    })
    .catch((error) => console.error("error Fetching goals:", error))
};

useEffect(() => {
    loadTransactions();
}, []);

console.log(transactions);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed, so January is 0
  
  const filteredByGoalType = transactions?.filter(transaction => transaction.goalType === "spending")
  console.log(filteredByGoalType)
  const filteredTransactions = filteredByGoalType.filter(transaction => {
    const transactionDate = new Date(transaction.transactionDate);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();
    
    
    return (
      transactionYear === currentYear && 
      transactionMonth === currentMonth
    )
  });
  
  const groupedTransaction = filteredTransactions.reduce((groups, transaction) =>
    {const { category, amount} = transaction;
    if (!groups[category]) {
      groups[category] = { category, balance: 0}
    }
    groups[category].balance += amount;
    return groups;
  }, {})


  const budgetData = Object.values(groupedTransaction).map(group => ({
    name: group.category,
    value: group.balance,
  }))

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <React.Fragment>
      <h4>Current Budgets:</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={budgetData}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            
          >
            {budgetData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)}/>
          <Legend
          />
        </PieChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default BudgetPieChart;
