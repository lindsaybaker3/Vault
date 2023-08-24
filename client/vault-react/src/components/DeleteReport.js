import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import FormattedDate from "../helpers/FormattedDate";
import DrawerComponent from "./Drawer";
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  Button,
} from "@mui/material";
import { CssBaseline } from "@mui/material";

function ConfirmDelete() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reportId = isNaN(params.reportId) ? null : parseInt(params.reportId);
    fetch(`http://localhost:8080/api/vault/report/${reportId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Report not found");
        }
      })
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/not-found");
      });
  }, [auth.user.token, navigate, params.reportId]);

  const handleDelete = () => {
    const reportId = isNaN(params.reportId) ? null : parseInt(params.reportId);
    fetch(`http://localhost:8080/api/vault/report/${reportId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate("/reports");
        } else {
          console.log(`Unexpected response status code: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting report:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!report) {
    return <p>Report not found.</p>;
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
                  Confirm Report Deletion
                </h2>
                <div>
                  <p>
                    {message ? (
                      <strong>{message}</strong>
                    ) : (
                      "Are you sure you want to delete this report?"
                    )}
                  </p>
                  <p>
                    This report covers the date range from{" "}
                    <strong>
                      <FormattedDate date={report.startDate} />
                    </strong>{" "}
                    to{" "}
                    <strong>
                      <FormattedDate date={report.endDate} />
                    </strong>
                    .
                  </p>
                  <p>
                    The report's goal type is{" "}
                    <strong>
                      {report.goalType === "spending" ? "Budget" : "Saving"}
                    </strong>
                    .
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
                  to="/reports"
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
