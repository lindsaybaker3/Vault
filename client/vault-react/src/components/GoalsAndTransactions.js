import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import ConfirmDeleteGoal from "./DeleteGoal";
import DeleteGoal from "./DeleteGoal";
import "../style/goalsandtransactions.css"
import { Box } from "@mui/system";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";



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
    <Box
    className="Goals-details-container"
    sx={{
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
        padding: '16px',
        width: '100%', // Adjust width as needed
      }}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {/* goal info */}
        <Grid item xs={8}>
            <h2 className="goal-header">{goal.categoryName}</h2>
        </Grid>
        <Grid item xs={4}>
          <h2 className="goal-currentbalance">Current Balance: {goal.currentBalance}</h2>
        </Grid>
        <Grid item xs={6}>
          <h2 className="goal-amount">Budget: {goal.amount}</h2>
          
        </Grid>
        <Grid item xs={12}>
          <h2 className="goal-dates">{goal.startDate} - {goal.endDate}</h2>
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
)

    //TODO: Do on success and create the actual return statement
}
export default GoalsAndTransactions;