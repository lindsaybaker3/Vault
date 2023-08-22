import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useContext, useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import AuthContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';



export default function TransactionsForDashboard() {

    const auth = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const theme = useTheme();
    const navigate = useNavigate();

    const NavigateToTransactionsPage = () => {
      navigate("/transactions");
    };

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

    
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed, so January is 0
  
  // Sort transactions by transactionDate in descending order (most recent first)
  const sortedTransactions = transactions
    .slice() // Create a copy of the array to avoid mutating the original
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

  // Limit the sorted transactions to the first five
  const limitedTransactions = sortedTransactions.slice(0, 5);
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {limitedTransactions.map((transaction) => (
            <TableRow key={transaction.transactionId}>
              <TableCell>{transaction.transactionDate}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" sx={{ mt: 3 }} onClick={NavigateToTransactionsPage}>
        See more transactions
      </Link>
    </React.Fragment>
  );
}