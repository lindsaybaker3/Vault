import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const TransactionsList = () => {
  const auth = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = () => {
    fetch("http://localhost:8080/api/vault/transactions", {
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => response.json())
      .then((payload) => setTransactions(payload));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Author ID</th>
          <th>Goal ID</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Transaction Date</th>
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
            <td>{transaction.description}</td>
            <td>{transaction.amount}</td>
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
