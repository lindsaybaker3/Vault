import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/transactionlist.css";

// import tables mui ui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";
import {  Container } from "@mui/system";
import DrawerComponent from "./Drawer";
import { Box, Button, Card, CardContent, CssBaseline, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import { Tab } from "@mui/base";
// ------

const TransactionsList = () => {
  const auth = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    await fetch("http://localhost:8080/api/vault/transactions", {
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => response.json())
      .then((payload) => {
        console.log(payload, "achei 2");
        if (payload) {
          setTransactions(payload);
        }
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <ThemeProvider theme = {createTheme()}>
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <DrawerComponent />
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
    <Container maxWidth = "lg" sx={{ mt: 4, mb: 4 }}>
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px', // Adjust the gap between cards
        paddingTop: '64px',
      }}>
      <TableContainer component = {Paper}>
        <Table sx = {{ minWidth: 650}} aria-label = "simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                Date
              </TableCell>
              <TableCell>
                Goal
              </TableCell>
              <TableCell>
                Description
              </TableCell>
              <TableCell>
                Amount
              </TableCell>
              <TableCell>
                Edit
              </TableCell>
              <TableCell>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key = {transaction.transactionId}>
                <TableCell>{transaction.transactionDate}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell><AmountDisplay amount={transaction.amount} /> </TableCell>
                <TableCell>  {auth.user && (
                  <Link to={`/edit/${transaction.transactionId}`}>Edit</Link>
                )}</TableCell>
                <TableCell>
                {auth.user && (
                  <Link to={`/delete/${transaction.transactionId}`}>
                    Delete
                  </Link>
                )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      <button>Add Transaction</button>
    </Box>
    </Container>
    </Box>
    </Box>
    </ThemeProvider>
  );
};

export default TransactionsList;

//  return (
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Transaction ID</TableCell>
//               <TableCell align="right">User ID</TableCell>
//               <TableCell align="right">Goal ID</TableCell>
//               <TableCell align="right">Goal Type</TableCell>
//               <TableCell align="right">Category</TableCell>
//               <TableCell align="right">Description</TableCell>
//               <TableCell align="right">Amount</TableCell>
//               <TableCell align="right">Date</TableCell>
//               <TableCell align="right">Edit?</TableCell>
//               <TableCell align="right">Delete?</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {transactions.map((transaction) => (
//               <TableRow key={transaction.transactionId}>
//                 <TableCell component="th" scope="row">
//                   {transaction.transactionId}
//                 </TableCell>
//                 <TableCell align="right">{transaction.appUserId}</TableCell>
//                 <TableCell align="right">{transaction.goalId}</TableCell>
//                 <TableCell align="right">{transaction.goalType}</TableCell>
//                 <TableCell align="right">{transaction.category}</TableCell>
//                 <TableCell align="right">{transaction.description}</TableCell>
//                 <TableCell align="right">{transaction.amount}</TableCell>
//                 <TableCell align="right">{transaction.date}</TableCell>
//                 <TableCell align="right">
//                   {auth.user && (
//                     <Link to={`/edit/${transaction.transactionId}`}>Edit</Link>
//                   )}
//                 </TableCell>
//                 <TableCell align="right">
//                   {auth.user && (
//                     <Link to={`/delete/${transaction.transactionId}`}>
//                       Delete
//                     </Link>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
