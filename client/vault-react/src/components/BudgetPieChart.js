import React from 'react';
import { PieChart, Pie, Sector, Cell, Legend, Tooltip } from 'recharts';
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
        console.log("Fetched transactions:", payload); // Add this line
        setTransactions(payload);
    })
    .catch((error) => console.error("error Fetching goals:", error))
};

useEffect(() => {
    loadTransactions();
}, []);

const budgetData = [
    { name: 'Food', value: transactions},
    { name: 'Rent', value: 1000 },
    { name: 'Entertainment', value: 300 },
    { name: 'Transportation', value: 200 },
    { name: 'Other', value: 100 },
  ];

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={budgetData}
        cx={200}
        cy={150}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {budgetData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default BudgetPieChart;
