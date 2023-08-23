import { type } from "@testing-library/user-event/dist/type";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/transactionForm/style.css";

const TransactionForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [goalType, setGoalType] = useState("spending");
  const [filteredGoals, setFilteredGoals] = useState([]);
  const typesList = getUniqueTypes(goals);

  const [errors, setErrors] = useState([]);

  const [formChanged, setFormChanged] = useState(false);

  const [appUserId, setAppUserId] = useState(auth.user?.appUserId || "");
  const [goalsId, setGoalsId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  function isDateBetweenLimits(dateToCheck, startDate, endDate) {
    const checkDateObj = new Date(dateToCheck);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    return checkDateObj >= startDateObj && checkDateObj <= endDateObj;
  }

  useEffect(() => {
    let today = new Date();
    let listOfGoals = goals.filter((item) => {
      if (params.transactionId) {
        today = new Date(transactionDate);
      }
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);

      today.setHours(0, 0, 0, 0);
      return (
        item.type === goalType && isDateBetweenLimits(today, startDate, endDate)
      );
    });
    console.log(params, "parametros");
    console.log(today, "today");
    console.log(listOfGoals, "list of goals");
    console.log(transactionDate, "transaction date");
    console.log(params.transactionId, "transaction id");
    setFilteredGoals(listOfGoals);
  }, [goalType, goals, params, params.transactionId, transactionDate]);

  console.log(filteredGoals, "filteredGoals");

  const currentDate = new Date();

  // Calculate the date of tomorrow
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);

  console.log(tomorrowDate, "amanha");
  console.log(currentDate, "data de hoje");

  const resetState = () => {
    setGoalsId("");
    setDescription("");
    setAmount("");
    setCategory("");
    setTransactionDate("");
  };

  console.log(category, "category");
  console.log(goals, "goals");
  const loadGoals = () => {
    if (!auth.user || !auth.user.token) {
      navigate("/");
      return;
    }
    fetch("http://localhost:8080/api/vault/goals", {
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => response.json())
      .then((payload) => {
        if (!params.transactionId) {
          setCategory(payload?.[0]?.categoryName);
          setGoalsId(payload?.[0]?.goalsId);
        }
        setGoals(payload);
      })
      .catch((error) => console.error("error Fetching questions:", error));
  };

  function getUniqueTypes(goalsList) {
    const uniqueTypes = [...new Set(goalsList.map((goal) => goal.type))];
    return uniqueTypes;
  }

  // function capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    if (!params.transactionId && !formChanged) {
      console.log("passou aqui");
      setCategory(filteredGoals[0]?.categoryName);
      setGoalsId(filteredGoals[0]?.goalsId);
    }
  }, [filteredGoals, goalType, formChanged, params.transactionId]);

  useEffect(() => {
    if (auth?.user?.appUserId) {
      setAppUserId(auth.user.appUserId);
    }
    if (params.transactionId !== undefined) {
      fetch(
        `http://localhost:8080/api/vault/transaction/${params.transactionId}`,
        {
          headers: {
            Authorization: "Bearer " + auth.user.token,
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log(`unexpected response status code: ${response.status}`);
          }
        })
        .then((Transaction) => {
          setAppUserId(Transaction.appUserId);
          setGoalsId(Transaction.goalsId);
          setDescription(Transaction.description);
          setAmount(Transaction.amount);
          setGoalType(Transaction.goalType);
          setCategory(Transaction.category);
          setTransactionDate(Transaction.transactionDate);
        })
        .catch((error) => {
          console.error("Error fetching transaction:", error);
        });
    } else {
      resetState();
    }
  }, [auth.user.token, params.transactionId]);

  console.log(params);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newTransaction = {
      goalsId: goalsId,
      description: description,
      amount: amount,
      transactionDate: transactionDate,
    };

    if (appUserId) {
      newTransaction.appUserId = appUserId;
    }

    let url = null;
    let method = null;
    if (params.transactionId !== undefined) {
      newTransaction.transactionId = params.transactionId;
      url = `http://localhost:8080/api/vault/transaction/${params.transactionId}`;
      method = "PUT";
    } else {
      url = "http://localhost:8080/api/vault/transaction";
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
  console.log(goals);
  console.log(goalsId);

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
      <h2 className="title">
        {params.transactionId ? "Edit Transaction!" : "Add your Transaction!"}
      </h2>
      <fieldset>
        <label htmlFor="goal-input">Goal Type:</label>
        <select
          id="goal-input"
          value={goalType}
          onChange={(evt) => {
            setGoalType(evt.target.value);
            setFormChanged(true);
          }}
        >
          {typesList.map((type) => (
            <option key={type} value={type}>
              {type === "spending" ? "Budgets" : "Saving"}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <label htmlFor="category-input">Category:</label>
        <select
          id="category-input"
          value={category}
          onChange={(evt) => {
            setCategory(evt.target.value);
            setFormChanged(true);
            setGoalsId(
              goals.find((item) => item.categoryName === evt.target.value)
                ?.goalsId
            );
          }}
        >
          {filteredGoals?.map((category) => (
            <option key={category.id} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <label htmlFor="description-input">Description:</label>
        <input
          id="description-input"
          value={description}
          onChange={(evt) => setDescription(evt.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="amount-input">Amount:</label>
        <input
          id="amount-input"
          type="number"
          value={amount}
          onChange={(evt) => setAmount(evt.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="date-input">Date:</label>
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
