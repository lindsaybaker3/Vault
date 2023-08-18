import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/transactionForm/style.css";

const TransactionForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [errors, setErrors] = useState([]);

  // mock response
  const responseBack = [
    {
      id: 1,
      name: "Usuário 1",
    },
    {
      id: 2,
      name: "Usuário 2",
    },
    {
      id: 3,
      name: "Usuário 1",
    },
    {
      id: 4,
      name: "Usuário 1",
    },
  ];

  function renderSelect(element, key) {
    // useEffect(
    //   `http://localhost:8080/api/vault/budgetcategory/saving`,
    //   {
    //     headers: {
    //       Authorization: "Bearer " + auth.user.token,
    //     },
    //   }
    //     .then((response) => response.json())
    //     .then((data) => setCategory(data))
    //     .catch((error) => console.error("Error fetching data:", error));
    // }, []);

    return (
      <Fragment key={key}>
        <option value={element.name}>{element.name}</option>
      </Fragment>
    );
  }

  // const [username, setUsername] = useState("");
  const [goalsId, setGoalsId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const resetState = () => {
    setGoalsId("");
    setDescription("");
    setAmount("");
    setCategory("");
    setGoal("");
    setTransactionDate("");
  };

  useEffect(() => {
    if (params.transactionId !== undefined) {
      fetch(
        `http://localhost:8080/api/vault/transaction/${params.transactionId}`,
        {
          headers: {
            Authorization: "Bearer " + auth.user.token,
          },
        }
      )
        .then((response) => response.json())
        .then((Transaction) => {
          setGoalsId(Transaction.goalsId);
          setDescription(Transaction.description);
          setAmount(Transaction.amount);
          // setGoal(Transaction.goal);
          // setCategory(Transaction.category);
          setTransactionDate(Transaction.transactionDate);
        })
        .catch((error) => {
          console.error("Error fetching transaction:", error);
        });
    } else {
      resetState();
    }
  }, [auth.user.token, params.transactionId]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newTransaction = {
      goalsId: goalsId,
      description: description,
      amount: amount,
      goals: goal,
      category: category,
      transactionDate: transactionDate,
    };

    let url = null;
    let method = null;

    if (params.id !== undefined) {
      newTransaction.id = params.id;
      url = `http://localhost:8080/api/vault/transaction/${params.id}`;
      method = "PUT";
    } else {
      url = "http://localhost:8080/api/vault/transaction/create";
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
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
      <h2 className="title">Add your Transaction !</h2>
      {/* <fieldset>
        <label htmlFor="goal-input">Goal Type:</label>
        <select
          id="goal-input"
          value={goalsId}
          onChange={(evt) => setGoalsId(evt.target.value)}
        >
          <option value="1">Savings</option>
          <option value="2">Expenses</option>
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="category-input">Category: </label>
        <select
          id="category-input"
          value={category}
          onChange={(evt) => setCategory(evt.target.value)}
        >
          <option value="">Selecione uma Opção</option>
          {responseBack.map(renderSelect)}
        </select>
      </fieldset> */}
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
          type="number"
          value={amount}
          onChange={(evt) => setAmount(evt.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="date-input">Date: </label>
        <input
          id="date-input"
          type="date"
          value={transactionDate}
          onChange={(evt) => setTransactionDate(evt.target.value)}
        />
      </fieldset>
      <div className="group-button">
        <Link className="btn btn-warning" to="/transactions">
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
