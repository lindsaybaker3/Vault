import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const TransactionForm = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [errors, setErrors] = useState([]);

  const [username, setUsername] = useState("");
  const [goalsId, setGoalsId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const resetState = () => {
    setGoalsId("");
    setDescription("");
    setAmount("");
    setTransactionDate("");
  };

  useEffect(() => {
    if (params.id !== undefined) {
      const targetTransaction = props.transactions.find(
        (transaction) => transaction.id === parseInt(params.id)
      );
      if (targetTransaction !== undefined) {
        setGoalsId(targetTransaction.goalsId);
        setDescription(targetTransaction.description);
        setAmount(targetTransaction.amount);
        setTransactionDate(targetTransaction.transactionDate);
      }
    } else {
      resetState();
    }
  }, [props.transactions, params.id]);

  useEffect(() => {
    if (props?.user?.username) setUsername(props.user.username);
  }, [props.user]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const newTransaction = {
      goalsId: goalsId,
      description: description, // Fixed typo here
      amount: amount,
      transactionDate: transactionDate,
    };

    let url = null;
    let method = null;

    if (params.id !== undefined) {
      newTransaction.id = params.id;
      url = `http://localhost:8080/api/vault/${params.id}`;
      method = "PUT";
    } else {
      url = "http://localhost:8080/api/vault";
      method = "POST";
    }

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + auth.user.token,
      },
      body: JSON.stringify(newTransaction),
    }).then((response) => {
      if (response.ok) {
        navigate("/transactions");
      } else {
        response.json().then((errors) => {
          if (Array.isArray(errors)) {
            setErrors(errors);
          } else {
            setErrors([errors]);
          }
        });
      }
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <h2 className="title">Ask your question !</h2>
      <fieldset>
        <label htmlFor="description-input">Description: </label>
        <input
          id="description-input"
          value={description}
          onChange={(evt) => setDescription(evt.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="amount-input">Amount: </label>
        <input
          id="amount-input"
          type="number" // Use appropriate input type
          value={amount}
          onChange={(evt) => setAmount(evt.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="date-input">Date: </label>
        <input
          id="date-input"
          type="date" // Use appropriate input type
          value={transactionDate}
          onChange={(evt) => setTransactionDate(evt.target.value)}
        />
      </fieldset>
      <div className="group-button">
        <Link className="btn btn-warning" to="/">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary">
          Submit Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
