import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import ConfirmDeleteGoal from "./DeleteGoal";
import DeleteGoal from "./DeleteGoal";
import "../style/goalsandtransactions.css"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DrawerComponent from "./Drawer";
import { Box, Button, Card, CardContent, CssBaseline, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import { Container, Stack } from "@mui/system";



const GoalsAndTransactions = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState([])
    const auth = useContext(AuthContext);
    const [goal, setGoal] = useState("");
    //TODO: may need to add more pieces of state but this is what i have right now

    const fetchGoalWithTransactions = () => {
        fetch(`http://localhost:8080/api/vault/goals/${params.goalsId}`,
        {headers: {
            Authorization: "Bearer " + auth.user.token 
        },
    })
    .then((response) => {
        if(response.ok){
            return response.json();
        } else {
            return Promise.reject("No Goal Exists");
        }
    })
    .then((setGoal))
    .catch((error) => {
        setErrors([error])
    })
        
}

const onSuccess = () => {
   fetchGoalWithTransactions();
}

useEffect(() => {
    if(!auth?.user?.token){
        return;
    }else {
        fetchGoalWithTransactions()
    }
}, [params.goalsId])
console.log(goal)

const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

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
    <Container maxWidth = "lg" sx={{ mt: 3, mb: 4 }}>
    <Box
    className="Goals-details-container"
    sx={{
      paddingTop: '60px',  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '16px', // Adjust the gap between elements
    }}
  >
    <Box 
      className="goal-section"
      sx={{
        padding: '10px',
        width: '100%', // Adjust width as needed
      }}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {/* goal info */}
        <Grid item xs={8}>
             <h2 style={{ color: '#69B45E' }}>{goal.categoryName}</h2>
        </Grid>
        <Grid item xs={4}>
          <h2 style={{ color: '#69B45E' }}>Current Balance: {goal.currentBalance}</h2>
        </Grid>
        <Grid item xs = {12}>
            <Box sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>

                 <h2 className="goal-amount">Budget: {goal.amount}</h2>

            </Box>
          
        </Grid>
        <Grid item xs>
          {/* Edit and Delete links */}
          <Box>
            <Link
              to={goal.type === 'spending' ? `/budgets/edit/${goal.goalsId}` : `/savings/edit/${goal.goalsId}`}
            >
              Edit
            </Link>
            <Link to="#" onClick={handleDeleteClick}>
              Delete
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12}>
        <Box sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="goal-dates">{goal.startDate} - {goal.endDate}</p>
        </Box>
        </Grid>
      </Grid>
    </Box>

    <Box
        className="transactions-section"
        sx={{
          padding: '16px',
          width: '100%', // Adjust width as needed
        }}
      >
        {/* Transactions table */}
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goal?.transactionsList?.map((transaction) => (
              <TableRow key={transaction.transactionId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{transaction.transactionDate}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
              </TableRow>
            ))}
             <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={2} align="left">Total Balance:</TableCell>
                <TableCell>{goal.currentBalance}</TableCell>
             </TableRow>
          </TableBody>
        </Table>
        </TableContainer>
      </Box>
      {showDeleteModal && (
        <DeleteGoal
          goal={goal}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    
   
    </Box>
    </Container>
    </Box>
    </Box>
    </ThemeProvider>
)

    //TODO: Do on success and create the actual return statement
}
export default GoalsAndTransactions;