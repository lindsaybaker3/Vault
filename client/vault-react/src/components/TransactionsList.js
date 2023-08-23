import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";
import { Container } from "@mui/system";
import DrawerComponent from "./Drawer";
import { Modal, styled, tableCellClasses } from "@mui/material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import DeleteTransaction from "./DeleteTransaction";
import { Tab } from "@mui/base";
// ------

const TransactionsList = () => {
  const auth = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [dateFilter, setDateFilter] = useState('currentMonth');

  const loadTransactions = async () => {
    await fetch("http://localhost:8080/api/vault/transactions", {
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          auth.logout();
        }
        return response.json();
      })
      .then((payload) => {
        if (payload) {
          setTransactions(payload);
        }
      });
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

    const parseDateString = (dateString) => {
      const [year, month, day] = dateString.split('-').map(Number);
          return new Date(year, month - 1, day); 
          };
  
      const filteredTransactions = sortedTransactions
      .filter((transaction) => {
        const transactionDate = parseDateString(transaction.transactionDate);//this goal date needs to be formatted different
        
        if (dateFilter === 'currentMonth') {
          return transactionDate.getMonth() === currentDate.getMonth()
    
        } else if (dateFilter === 'lastMonth'){
          const lastMonthStartDate = new Date(currentYear, currentMonth - 1, 1);
          const lastMonthEndDate = new Date(currentYear, currentMonth, 0);
           return transactionDate >= lastMonthStartDate && transactionDate <= lastMonthEndDate
        } else if (dateFilter === 'pastThree') {
          const lastThreeMonthsStartDate = new Date(currentYear, currentMonth -3, 1)
          return transactionDate >= lastThreeMonthsStartDate
        } else if (dateFilter === 'thisYear') {
          return transactionDate.getFullYear() === currentDate.getFullYear()
        } else if (dateFilter === 'lastYear') {
          const lastYear = new Date(currentYear -1, currentMonth, 1)
          return transactionDate.getFullYear() === lastYear.getFullYear()
        }
      
        return true; 
    });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#05391F",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <DrawerComponent />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            paddingTop: "64px",
            border: "1px solid #000",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                paddingBottom: "45px",
                borderBottom: "1px solid  #ccc",
              }}
            >
              <Grid container>
                <Grid item xs={10}>
                  <h1>Transactions</h1>
                </Grid>
                <Grid sx={{ paddingTop: "11px" }} item xs={2}>
                  <Link to="/transaction/add">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        marginTop: "16px",
                        backgroundColor: "#05391F",
                        color: "#FFFFFF",
                        "&:hover": {
                          backgroundColor: "#69B45E",
                        },
                      }}
                    >
                      Add Transaction
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12}>
            <p>Filter By Date</p>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="currentMonth">Current Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="pastThree">Past Three Months</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last year</option>
              <option value="All">All Transactions</option>
            </select>
          </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "16px", // Adjust the gap between cards
                paddingTop: "64px",
              }}
            >
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Goal</StyledTableCell>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell align="left">Amount</StyledTableCell>
                      <StyledTableCell align="center">Edit</StyledTableCell>
                      <StyledTableCell align="center">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions?.map((transaction) => (
                      <TableRow key={transaction.transactionId}>
                        <StyledTableCell>
                          <FormattedDate date={transaction.transactionDate} />
                        </StyledTableCell>
                        <StyledTableCell>
                          {transaction.category}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transaction.description}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {transaction.goalType === "saving" ? "+" : "-"}{" "}
                          <AmountDisplay amount={transaction.amount} />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {auth.user && (
                            <Link to={`/edit/${transaction.transactionId}`}>
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  // marginTop: '16px',
                                  backgroundColor: "#05391F",
                                  color: "#FFFFFF",
                                  "&:hover": {
                                    backgroundColor: "#69B45E",
                                  },
                                }}
                              >
                                {" "}
                                Edit{" "}
                              </Button>
                            </Link>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {auth.user && (
                            <Link
                              to={`/deleteTransaction/${transaction.transactionId}`}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  // marginTop: '16px',
                                  backgroundColor: "red",
                                  color: "#FFFFFF",
                                  "&:hover": {
                                    backgroundColor: "#69B45E",
                                  },
                                }}
                              >
                                Delete{" "}
                              </Button>
                            </Link>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TransactionsList;
