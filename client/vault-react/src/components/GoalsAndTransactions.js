import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import ConfirmDeleteGoal from "./DeleteGoal";
import DeleteGoal from "./DeleteGoal";
import "../style/goalsandtransactions.css"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from "@mui/material";
import DrawerComponent from "./Drawer";
import { Box, Button, Card, CardContent, CssBaseline, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import { Container, Stack, style } from "@mui/system";
import { Modal} from "@mui/material";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";




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
        } else if (response.status === 403){
            auth.logout();
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

const handleClose = () => {
  setShowDeleteModal(false);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const hasTransactions = goal.transactionsList && goal.transactionsList.length > 0;

const formattedStart = formatDate(goal.startDate)
const formattedEnd = formatDate(goal.endDate)

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#05391F',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));



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
        // padding: '10px',
        width: '100%', // Adjust width as needed
        borderBottom: '1px solid  #ccc'
      }}
    >
      <Grid container>
              {/* goal info */}
        <Grid item xs={10}>
             <h1>{goal.categoryName}</h1>
             <h4> Budget: <AmountDisplay amount = {goal.amount} /> </h4>
             <h4>Current Balance: <AmountDisplay amount = {goal.currentBalance} /> </h4>
            
        </Grid>
        <Grid item xs = {2}>
          {/* Edit and Delete links */}
          <Box>
            <Link
              to={goal.type === 'spending' ? `/budgets/edit/${goal.goalsId}` : `/savings/edit/${goal.goalsId}`}
            >
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
              }}> Edit </Button>
            </Link>
            {!hasTransactions && (
                <Link to="#" onClick={handleDeleteClick}>
                <Button
                  variant="contained"
                  color="primary" 
                  sx={{
                    marginTop: '16px',
                    backgroundColor: 'red', 
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#69B45E', 
                    },
                  }}>
                  Delete </Button>
                </Link>
            )}
            
          </Box>
        </Grid>
      </Grid>
    </Box>
    
        <Box sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p> Transactions from: {formattedStart} to {formattedEnd}</p>
        </Box>
    

    <Box
        className="transactions-section"
        sx={{
          // padding: '16px',
          width: '100%', // Adjust width as needed
        }}
      >
        {/* Transactions table */}
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align = "center">Description</StyledTableCell>
              <StyledTableCell align="center">Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goal?.transactionsList?.map((transaction) => (
              <TableRow key={transaction.transactionId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <StyledTableCell> <FormattedDate date = {transaction.transactionDate} /></StyledTableCell>
                <StyledTableCell align = "center">{transaction.description}</StyledTableCell>
                <StyledTableCell align="center"> <AmountDisplay amount = {transaction.amount} /></StyledTableCell>
              </TableRow>
            ))}
             <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: '#eeeeee'}}>
                <StyledTableCell sx = {{fontWeight: 'bold'}} colSpan={2} align="left">Total Balance:</StyledTableCell>
                <StyledTableCell sx = {{fontWeight: 'bold'}} align="center"> <AmountDisplay amount = {goal.currentBalance} /> </StyledTableCell>
             </TableRow>
          </TableBody>
        </Table>
        </TableContainer>
      </Box>
      <Modal
        open = {showDeleteModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      
        <DeleteGoal
          goal={goal}
          onClose={handleClose}
        />
      

      </Modal>
    </Box>
    </Container>
    </Box>
    </Box>
    </ThemeProvider>
)

    //TODO: Do on success and create the actual return statement
}
export default GoalsAndTransactions;