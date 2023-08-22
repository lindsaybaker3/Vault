import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, createTheme } from "@mui/system";
import { CssBaseline } from "@mui/material";
import DrawerComponent from "./Drawer";

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
        console.error("Error deleting transaction:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!report) {
    return <p>Transaction not found.</p>;
  }

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
              <div className="delete-report">
                <h2>Confirm Delete</h2>
                <p>Delete this Report?</p>
                <ul>
                  <li>Start Range Date: {report.startDate}</li>
                  <li>Start End Date: {report.endDate}</li>
                  <li>Goal Type: {report.goalType}</li>
                  <li>Report: {report.reportUrl}</li>
                </ul>
                <button onClick={handleDelete}>Delete Report</button>{" "}
                <Link to="/reports">Cancel</Link>
              </div>{" "}
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ConfirmDelete;
