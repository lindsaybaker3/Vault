import { useState, useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import '../style/goalslist.css'
import { Box, Button, Card, CardContent, CssBaseline, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import DrawerComponent from "./Drawer";
import { Container } from "@mui/system";


const GoalsList = ({ type }) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);


   
    const loadGoals = () => {
        if(!auth.user || !auth.user.token){
            navigate("/");
            return;
        }
        fetch("http://localhost:8080/api/vault/goals", {
            headers: {
                Authorization: "Bearer " + auth.user.token,
            },

        })
        .then(response => response.json())
        .then(payload => setGoals(payload))
        .catch((error) => console.error("error Fetching goals:", error))
    }

    useEffect(loadGoals, [])

    const filteredGoals = goals.filter(goal => goal.type === type);
    console.log(filteredGoals)

    const addLinkPath = type === "spending" ? "/budgets/add" : "/savings/add"

   
    return (
      <ThemeProvider theme = {createTheme()}>
      <Box sx={{ display: 'flex' }}>
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
        }}
      >
      <Container maxWidth = "lg" sx={{ mt: 4, mb: 4 }}>
      
        <Box
        className="card-container"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px', // Adjust the gap between cards
          flexWrap: 'wrap', // Allow cards to wrap when there's limited space
          paddingTop: '64px',
        }}
      >
          {filteredGoals.map((goal) => (
        <Link key={goal.goalsId} to={`/budgets/${goal.goalsId}`} className="card">
            
            <Card  variant="outlined" sx={{ minWidth: 275, height: '200px'}}>
          <CardContent
            sx={{
              backgroundColor: '#f5f5f5', // Adjust the background color
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            <Typography variant="h5" component="div">{goal.categoryName}</Typography>
            <LinearProgress
                    variant="determinate"
                    value={Math.min((goal.currentBalance / goal.amount) * 100, 100)}
                    sx={{
                      marginTop: '16px',
                      backgroundColor: (theme) =>
                      goal.currentBalance >= goal.amount
                          ? theme.palette.error.main // Use error color when balance exceeds goal
                          : undefined, // Use default background color when not exceeded
                    }}
                  />
                  <Typography variant="body2">
                    Progress: {((goal.currentBalance / goal.amount) * 100).toFixed(2)}%
                  </Typography>
          </CardContent>

            </Card>
        </Link>
      ))}
       <Link href={addLinkPath} className="add-button">
        <Link to = {addLinkPath} className = "add=button">
          Add {type === 'spending' ? 'budget' : 'saving'}
        </Link>
      </Link>
    </Box>
    </Container>
    </Box>
    </Box>
    </ThemeProvider>
  );
};

      

export default GoalsList;