import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { Box, Container} from "@mui/system";
import { CssBaseline, TextField } from "@mui/material";
import { Button} from "@mui/base";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from "@mui/material";
import DrawerComponent from "./Drawer";
import Logo from "../images/piggybank.png";



const SignupForm = ({ addUser }) => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

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
  console.log(errors, "errors");
  return (
    <ThemeProvider theme={createTheme()}>
    <CssBaseline />
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        paddingTop: '80px',
      }}
    >
      <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
        <Box
          className="login-form"
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
          {/* Logo image */}
          <img
            src={Logo}
            alt="Logo"
            style={{ width: '100px', marginBottom: '20px' }}
          />
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#05391f",
          padding: '6px'}}>
          Sign Up
        </Typography>



      <form onSubmit={handleSubmit}>
        {errors.map((error, i) => (
          <div key={i}>{error}</div>
        ))}
        <fieldset>
          <label htmlFor="firstname-input">First Name: </label>
          <input
            id="firstname-input"
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="lastname-input">Last Name: </label>
          <input
            id="lastname-input"
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="username-input">Username: </label>
          <input
            id="username-input"
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password-input">Password: </label>
          <input
            id="password-input"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
        </fieldset>
        <div className="group-button">
            <Button type="submit" variant="contained" alignItems="center">
              Create User
            </Button>        
          </div>
      </form>
    </Box>
    </Container>
    </Box>
    </ThemeProvider>
  );
};

export default SignupForm;
