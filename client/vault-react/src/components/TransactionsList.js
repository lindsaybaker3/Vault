import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";
import "../styles/transactionlist.css";

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
    <div>
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
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="10">No transactions available.</td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td>{transaction.transactionId}</td>
                <td>{transaction.appUserId}</td>
                <td>{transaction.goalsId}</td>
                <td>{transaction.goalType}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>
                  <AmountDisplay amount={transaction.amount} />
                </td>
                <td>
                  {/* Assuming FormattedDate is a custom component */}
                  <FormattedDate date={transaction.transactionDate} />
                </td>
                <td>
                  {auth.user && (
                    <Link to={`/edit/${transaction.transactionId}`}>Edit</Link>
                  )}
                </td>
                <td>
                  {auth.user && (
                    <Link to={`/delete/${transaction.transactionId}`}>
                      Delete
                    </Link>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button>
        <Link to="/transaction/add">Add Transaction</Link>
      </button>
    </div>
  );
};

export default TransactionsList;
