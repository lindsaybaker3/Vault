import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

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
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>User ID</th>
          <th>Goal ID</th>
          <th>Goal Type</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Edit?</th>
          <th>Delete?</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.transactionId}>
            <td>{transaction.transactionId}</td>
            <td>{transaction.appUserId}</td>
            <td>{transaction.goalsId}</td>
            <td>{transaction.goal_type}</td>
            <td>{transaction.category}</td>
            <td>{transaction.description}</td>
            <td>
              <AmountDisplay amount={transaction.amount} />
            </td>

            {/* <td>
              <FormattedDate date={transaction.transactionDate} />
            </td> */}
            <td>{transaction.transactionDate}</td>
            <td>
              {auth.user && (
                <Link to={`/edit/${transaction.transactionId}`}>Edit</Link>
              )}
            </td>
            <td>
              {auth.user && (
                <Link to={`/delete/${transaction.transactionId}`}>Delete</Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
