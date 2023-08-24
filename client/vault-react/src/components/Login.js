import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Dashboard from "./Dashboard";
import { Box, Container} from "@mui/system";
import { CssBaseline, TextField } from "@mui/material";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, Button } from "@mui/material";
import DrawerComponent from "./Drawer";
import Logo from "../images/piggybank.png";



export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status === 200) {
      const { jwt_token } = await response.json();
      console.log(jwt_token);
      auth.login(jwt_token);
      navigate("/dashboard");
    } else if (response.status === 403) {
      setErrors(["Login failed."]);
    } else {
      setErrors(["Unknown error."]);
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
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
            component="form"
            sx={{
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '16px',
              paddingBottom: '20px',
              paddingLeft: '20px',
              paddingRight: '20px',
              border: '8px solid #05391f',
              backgroundColor: "#ffffff"
            }}
          >
            {/* Logo image */}
            <img
              src={Logo}
              alt="Logo"
              style={{ width: '100px', marginBottom: '10px' }}
            />
  
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#05391f", padding: '6px' }}>
              Login
            </Typography>
  
            <Box
              
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
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <ul>
                {errors.map((error, i) => (
                  <div key={i}> {error} </div>
                ))}
              </ul>
              <TextField
                id="username"
                label="Username:"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                fullWidth
                sx={{
                  width: '160%', // Adjust the width value as needed
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="password"
                label="Password:"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                sx={{
                  width: '160%', // Adjust the width value as needed
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
                  marginTop: '16px',
                  backgroundColor: "#05391F",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#69B45E",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={handleCancelClick}
                color="primary"
                sx={{
                  marginTop: '8px',
                  color: '#ffffff',
                  backgroundColor: '#05391f',
                  '&:hover': {
                    backgroundColor: 'red',
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
}