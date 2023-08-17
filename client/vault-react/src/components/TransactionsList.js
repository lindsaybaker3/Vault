import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const TransactionsList = (props) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //   if (!user || !user.token) {
  //     return (
  //       <div>
  //         You must be logged in to view the list of transactions.
  //         <br />
  //         <Link to="/login">Log in</Link>
  //       </div>
  //     );
  //   }

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
        {props.transactions.map((transaction) => (
          <tr key={transaction.transactionId}>
            <td>{transaction.transactionId}</td>
            <td>{transaction.appUserId}</td>
            <td>{transaction.goalsId}</td>
            <td>{transaction.description}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.transactionDate}</td>
            <td>
              <Link to={`/edit/${transaction.id}`}>Edit</Link>
            </td>
            <td>
              <Link to={`/delete/${transaction.id}`}>Delete</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsList;
