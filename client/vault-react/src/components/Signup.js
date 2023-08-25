import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/system";
import { CssBaseline, TextField } from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import DrawerComponent from "./Drawer";
import Logo from "../images/piggybank.png";

const SignupForm = ({ addUser }) => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate("/");
  };

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    roles: ["USER"],
    enabled: true,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/");
          setUserData({
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            roles: ["USER"],
            enabled: true,
          });
        } else {
          return response.json();
        }
      })
      .then((errors) => {
        console.log(errors);
        const errorsList = errors?.errorMessages;
        if (Array.isArray(errorsList)) {
          setErrors(errorsList);
        } else {
          setErrors([errorsList]);
        }
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
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
              paddingTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "10px",
              paddingBottom: "20px",
              paddingLeft: "10px",
              paddingRight: "10px",
              border: "8px solid #05391f",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Logo image */}
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "100px", marginBottom: "20px" }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#05391f", padding: "6px" }}
            >
              Sign Up
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
                width: "90%",
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <ul>
                {errors.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </ul>
              <TextField
                id="firstname-input"
                label="First Name:"
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                sx={{
                  width: "120%", // Adjust the width value as needed
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="lastname-input"
                label="Last Name:"
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                sx={{
                  width: "120%", // Adjust the width value as needed
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="username-input"
                label="Username:"
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                sx={{
                  width: "120%", // Adjust the width value as needed
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="password-input"
                label="Password:"
                type="text"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                sx={{
                  width: "120%", // Adjust the width value as needed
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
                Create User
              </Button>
              <Button
                variant="contained"
                onClick={handleCancelClick}
                color="primary"
                sx={{
                  marginTop: "8px",
                  color: "#ffffff",
                  backgroundColor: "#05391f",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SignupForm;
