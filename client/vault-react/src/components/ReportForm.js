import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { CssBaseline, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import DrawerComponent from "./Drawer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Box, Container, Button } from "@mui/material";

const Form = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleCancelClick = () => {
    navigate(-1);
  };

  const [errors, setErrors] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goalType, setGoalType] = useState("");

  const resetState = () => {
    setStartDate("");
    setEndDate("");
    setGoalType("");
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newReport = {
      startDate: startDate,
      endDate: endDate,
      goalType: goalType,
    };

    fetch("http://localhost:8080/api/vault/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + auth.user.token,
      },
      body: JSON.stringify(newReport),
    }).then((response) => {
      if (response.ok) {
        navigate("/reports");
        resetState();
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
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
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
            paddingTop: "80px",
          }}
        >
          <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
            <Box
              component="form"
              sx={{
                paddingTop: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "16px",
                paddingBottom: "20px",
                paddingLeft: "10px",
                paddingRight: "10px",
                border: "5px solid #05391f",
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#FAF9F6",
                  backgroundColor: "#05391f",
                  padding: "8px",
                  borderRadius: "2px",
                  border: "2px solid #05391f",
                }}
              >
                Make A New Report
              </Typography>

              <Box
                component="form"
                sx={{
                  paddingTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: "16px",
                  paddingBottom: "20px",
                  paddingLeft: "60px",
                  paddingRight: "60px",
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
                  id="startdate-input"
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(evt) => setStartDate(evt.target.value)}
                  fullWidth
                  sx={{
                    width: "160%", // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="enddate-input"
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(evt) => setEndDate(evt.target.value)}
                  fullWidth
                  sx={{
                    width: "160%", // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  id="goal-input"
                  select
                  label="Goal Type:"
                  value={goalType}
                  onChange={(evt) => setGoalType(evt.target.value)}
                  fullWidth
                  sx={{
                    width: "160%", // Adjust the width value as needed
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem value="spending">Budgets</MenuItem>
                  <MenuItem value="saving">Saving</MenuItem>
                </TextField>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    marginTop: "16px",
                    backgroundColor: "#05391F",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#69B45E",
                    },
                  }}
                >
                  {" "}
                  Create Report{" "}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCancelClick}
                  color="primary"
                  sx={{
                    marginTop: "8px",
                    backgroundColor: "red",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#69B45E",
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

export default Form;
