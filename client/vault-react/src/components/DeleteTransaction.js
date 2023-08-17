import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function ConfirmDelete(props) {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const targetTransaction = props.transactions.find(
      (transaction) => transaction.id === parseInt(params.id)
    );
    if (targetTransaction !== undefined) {
      setTransaction({ ...targetTransaction });
    } else {
      navigate("/");
    }
  }, [props.transactions, params.id, navigate]);

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/vault/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    }).then((response) => {
      if (response.ok) {
        navigate("/");
        props.loadPanels();
      } else {
        console.log(`Unexpected response status code: ${response.status}`);
      }
    });
  };

  if (transaction === null) {
    return null;
  }

  return (
    <>
      <h2>Confirm Delete</h2>
      <p>Delete this Transaction?</p>
      <ul>
        <li>Description: {transaction.description}</li>
        <li>Amount: {transaction.amount}</li>
        <li>Date: {transaction.transactionDate}</li>
      </ul>
      <button onClick={handleDelete}>Delete</button>
      <Link to="/">Cancel</Link>
    </>
  );
}

export default ConfirmDelete;
