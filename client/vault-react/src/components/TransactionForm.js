import { type } from "@testing-library/user-event/dist/type";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/transactionForm/style.css";

import DrawerComponent from "./Drawer";

import { Box, Container} from "@mui/system";
import { CssBaseline, TextField } from "@mui/material";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, Button, MenuItem } from "@mui/material";


const TransactionForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate(-1);
  };

  const auth = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [goalType, setGoalType] = useState("spending");
  const [filteredGoals, setFilteredGoals] = useState([]);
  const typesList = getUniqueTypes(goals);

  //  const filteredGoals = goals.filter((item) => item.type === goalType);

  function isDateBetweenLimits(dateToCheck, startDate, endDate) {
    const checkDateObj = new Date(dateToCheck);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    return checkDateObj >= startDateObj && checkDateObj <= endDateObj;
  }

  useEffect(() => {
    let listOfGoals = goals.filter((item) => {
      const today = new Date();
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);

      today.setHours(0, 0, 0, 0);
      return (
        item.type === goalType && isDateBetweenLimits(today, startDate, endDate)
      );
    });
    console.log(listOfGoals, "list of goals");
    setFilteredGoals(listOfGoals);
  }, [goalType, goals]);

  console.log(filteredGoals, "filteredGoals");

  const [errors, setErrors] = useState([]);
  const [formChanged, setFormChanged] = useState(false);

  const [appUserId, setAppUserId] = useState(auth.user?.appUserId || "");
  const [goalsId, setGoalsId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

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
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <CssBaseline />
        <DrawerComponent />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            paddingTop: '80px',
          }}
        >
          <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
            <Box
              sx={{
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '10px',
                paddingBottom: '20px',
                paddingLeft: '10px',
                paddingRight: '10px',
                border: '8px solid #05391f',
                backgroundColor: '#ffffff',
              }}
            >
  
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', color: '#05391f', padding: '6px' }}
              >
                {params.transactionId ? "Edit Transaction!" : "Add your Transaction!"}
              </Typography>
              <Box
                component="form"
                sx={{
                  paddingTop: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: '16px',
                  paddingBottom: '20px',
                  paddingLeft: '60px',
                  paddingRight: '60px',
                  width: '100%', // Adjust the width value as needed
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
                <TextField
                  id="goal-input"
                  select
                  label="Goal Type"
                  value={goalType}
                  onChange={(evt) => {
                    setGoalType(evt.target.value);
                    setFormChanged(true);
                  }}
                  fullWidth
                  sx={{
                    width: '100%', // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {typesList.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type === "spending" ? "Budgets" : "Saving"}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="category-input"
                  select
                  label="Category"
                  value={category}
                  onChange={(evt) => {
                    setCategory(evt.target.value);
                    setFormChanged(true);
                    setGoalsId(
                      goals.find((item) => item.categoryName === evt.target.value)?.goalsId
                    );
                  }}
                  fullWidth
                  sx={{
                    width: '100%', // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {filteredGoals?.map((category) => (
                    <MenuItem key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </TextField>
  
                <TextField
                  id="description-input"
                  label="Description"
                  type="text"
                  value={description}
                  onChange={(evt) => setDescription(evt.target.value)}
                  fullWidth
                  sx={{
                    width: '100%', // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
  
                <TextField
                  id="amount-input"
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(evt) => setAmount(evt.target.value)}
                  fullWidth
                  sx={{
                    width: '100%', // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="date-input"
                  label="Date"
                  type="date"
                  value={transactionDate}
                  onChange={(evt) => setTransactionDate(evt.target.value)}
                  fullWidth
                  sx={{
                    width: '100%', // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
  
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    marginTop: '16px',
                    backgroundColor: "#05391F",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#69B45E",
                    },
                  }}
                >
                  {" "}
                  Submit Transaction{" "}
                </Button>
  
                <Button
                  variant="contained"
                  onClick={handleCancelClick}
                  color="primary"
                  sx={{
                    marginTop: '8px',
                    backgroundColor: 'red',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#69B45E',
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
  
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default TransactionForm;
