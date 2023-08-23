import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  Button,
} from "@mui/material";
import { CssBaseline } from "@mui/material";
import DrawerComponent from "./Drawer";

function ConfirmDelete() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [auth.user.token, navigate, params.transactionId]);

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

  const getUsernameWithoutDomain = (username) => {
    const parts = username.split("@");
    return parts[0];
  };

  const message = `Hey ${getUsernameWithoutDomain(auth.user.username)
    .charAt(0)
    .toUpperCase()}${getUsernameWithoutDomain(auth.user.username).slice(1)}, `;

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <DrawerComponent />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "60%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <div>
                <h2 style={{ marginBottom: "20px" }}>
                  Delete this Transaction?
                </h2>
                <div>
                  <p>
                    <strong> {message}</strong>
                  </p>
                  <p>Are you sure you want to delete this transaction?</p>
                  <p>
                    <div>
                      <strong>Goal Type:</strong>{" "}
                      {transaction.goalType === "spending"
                        ? "Budget"
                        : "Saving"}
                    </div>
                  </p>
                  <p>
                    <strong>Category:</strong> {transaction.category}
                  </p>
                  <p>
                    <strong>Description:</strong> {transaction.description}
                  </p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    <AmountDisplay amount={transaction.amount} />
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    <FormattedDate date={transaction.transactionDate} />
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "red",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#69b45E",
                    },
                    marginRight: "10px",
                  }}
                  onClick={handleDelete}
                >
                  Delete
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "#05391F",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#69B45E",
                    },
                  }}
                  component={Link}
                  to="/transactions"
                >
                  Cancel
                </Button>
              </div>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ConfirmDelete;
