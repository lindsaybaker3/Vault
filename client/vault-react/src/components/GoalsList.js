import { useState, useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import '../style/goalslist.css'
import { Box, Button, Card, CardContent, CssBaseline, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import DrawerComponent from "./Drawer";
import { Container, Stack } from "@mui/system";
import FormattedDate from "../helpers/FormattedDate";


const GoalsList = ({ type }) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [dateFilter, setDateFilter] = useState('currentMonth');

   
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
        .then((response) => {
          if(response.status === 403) {
            auth.logout()
          }
          return response.json()
        })
        .then(payload => setGoals(payload))
        .catch((error) => console.error("error Fetching goals:", error))
    }

    useEffect(loadGoals, [])

    const sortedGoals = goals
    .slice() // Create a copy of the array to avoid mutating the original
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const parseDateString = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); 
        };

    const filteredGoals = sortedGoals
    .filter((goal) => goal.type === type)
    .filter((goal) => {
      const goalDate = parseDateString(goal.startDate);
      
      if (dateFilter === 'currentMonth') {
        return goalDate.getFullYear() === currentDate.getFullYear() && goalDate.getMonth() === currentDate.getMonth()
  
      } else if (dateFilter === 'lastMonth'){
        const lastMonthStartDate = new Date(currentYear, currentMonth - 1, 1);
        const lastMonthEndDate = new Date(currentYear, currentMonth, 0);
         return goalDate >= lastMonthStartDate && goalDate <= lastMonthEndDate
      } else if (dateFilter === 'pastThree') {
        const lastThreeMonthsStartDate = new Date(currentYear, currentMonth -3, 1)
        return goalDate >= lastThreeMonthsStartDate
      } else if (dateFilter === 'thisYear') {
        return goalDate.getFullYear() === currentDate.getFullYear()
      } else if (dateFilter === 'lastYear') {
        const lastYear = new Date(currentYear -1, currentMonth, 1)
        return goalDate.getFullYear() === lastYear.getFullYear()
      }
    
      return true; 
  });
   


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
          paddingTop: '64px',
        }}
      >
      <Container maxWidth = "lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{
          display: 'flex',
          paddingBottom: '35px',
          borderBottom: '1px solid  #ccc',
          position: 'sticky',
          top: 0,
          backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
            zIndex: 100,
        }}>
          <Grid container>
          <Grid item xs={10}>
            <h1>{type === 'spending' ? "Budgets:" : "Savings Goals:"}</h1>
          </Grid>
          <Grid sx = {{paddingTop: '10px', paddingLeft: '25px'}} item xs = {2}>
           <Link to = {addLinkPath} className = "add=button">
              <Button
              variant="contained"
              color="primary" 
              sx={{
                marginTop: '16px',
                backgroundColor: '#05391F', 
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#69B45E', 
                },
              }}>
              Add {type === 'spending' ? 'budget' : 'saving'}
                </Button>
          </Link>
          </Grid>
          <Grid item xs={12}>
          <p>Filter By Date</p>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="currentMonth">Current Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="pastThree">Past Three Months</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last year</option>
              <option value="All">All Goals</option>
            </select>
          </Grid>
       </Grid>
        </Box>
      
        <Stack
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'left',
          gap: '16px', // Adjust the gap between cards
          paddingTop: '35px',
        }}
      >
          {filteredGoals.map((goal) => (
        <Link key={goal.goalsId} to={`/budgets/${goal.goalsId}`} className="card">
            
           <Card  variant="outlined" sx={{ minWidth: 500}}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
              borderRadius: '8px',
              textDecoration: 'none',
              
            }}
          >
            <Grid container spacing={2}>
            <Grid item xs={10}>
            <Typography variant="h5" component="div">{goal.categoryName}</Typography>
            </Grid>
            <Grid item sx ={{paddingLeft: '20px'}} xs = {2}>
              <Typography variant="caption">
                <FormattedDate date={goal.startDate}></FormattedDate> to{' '}
                <FormattedDate date={goal.endDate}></FormattedDate>
              </Typography>
            </Grid>

            </Grid>
            
            <LinearProgress
                    variant="determinate"
                    value={Math.min((goal.currentBalance / goal.amount) * 100, 100)}
                    sx={{
                      marginTop: '16px',
                      backgroundColor: (theme) =>
                      goal.currentBalance >= goal.amount
                        ? goal.type === 'spending'
                        ? theme.palette.error.main
                          : theme.palette.success.main 
                          : undefined, 
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: (theme) => 
                            goal.currentBalance >= goal.amount
                            ? goal.type === 'spending'
                              ? theme.palette.error.main // Red for budgets
                              : theme.palette.success.main // Green for savings
                            : undefined,
                          }
                    }}
                  />
                  <Typography variant="body2">
                    {((goal.currentBalance / goal.amount) * 100).toFixed(2)}% to your goal
                  </Typography>
          </CardContent>
        </Card>
      </Link>
    ))}
    </Stack>
  </Container>
  </Box>
  </Box>
  </ThemeProvider>
  );
};

      

export default GoalsList;