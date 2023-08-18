import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";

function ConfirmDelete() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debugger;
    const transactionId = isNaN(params.transactionId)
      ? null
      : parseInt(params.transactionId);
    fetch(`http://localhost:8080/api/vault/transaction/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Transaction not found");
        }
      })
      .then((data) => {
        setTransaction(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/not-found");
      });
  }, [params.transactionId]);

  const handleDelete = () => {
    const transactionId = isNaN(params.transactionId)
      ? null
      : parseInt(params.transactionId);
    fetch(`http://localhost:8080/api/vault/transaction/${transactionId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate("/transactions");
        } else {
          console.log(`Unexpected response status code: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting transaction:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!transaction) {
    return <p>Transaction not found.</p>;
  }

  return (
    <>
      <h2>Confirm Delete</h2>
      <p>Delete this Transaction?</p>
      {/* return `On ${formattedDate}, you spent $${transaction.amount} towards the
      category "${transaction.category}" for ${transaction.description}.`; */}
      <ul>
        <li>Goal Type: {transaction.goal_type}</li>
        <li>Category: {transaction.category}</li>
        <li>Description: {transaction.description}</li>
        <li>
          Amount: <AmountDisplay amount={transaction.amount} />
        </li>
        <li>
          Date: <FormattedDate date={transaction.transactionDate} />
        </li>
        {/* <li>
          On <FormattedDate date={transaction.transactionDate} />, you spent{" "}
          <AmountDisplay amount={transaction.amount} /> towards the category "
          {transaction.category}" for {transaction.description}.
        </li>  */}
      </ul>
      <button onClick={handleDelete}>Delete Transaction</button>{" "}
      <Link to="/transactions">Cancel</Link>
    </>
  );
}

export default ConfirmDelete;
