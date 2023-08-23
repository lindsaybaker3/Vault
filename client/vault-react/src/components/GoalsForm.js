import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import '../style/goalslist.css'
import { Box, Container} from "@mui/system";
import { CssBaseline, TextField, Button } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import DrawerComponent from "./Drawer";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from "@mui/material";

const GoalsForm = (props) => {
    const auth = useContext(AuthContext);
    const params = useParams();
    const navigate = useNavigate();

    const handleCancelClick = () => {
        navigate(-1);
      };

    const [errors, setErrors] = useState([])

   const[appUserId, setAppUserId] = useState(auth.user?.appUserId || "")
    const [categoryId, setCategoryId] = useState("")
    const [type, setType] = useState(props.type)
    const[amount, setAmount] = useState("")
    const[startDate, setStartDate] = useState("")
    const[endDate, setEndDate] = useState("")

    const resetState = () => {
        setCategoryId("")
        setAmount("")
        setStartDate("")
        setEndDate("")
    }

    useEffect(() => {
        if(auth?.user?.appUserId){
            setAppUserId(auth.user.appUserId);
        }
        if (params.goalsId !== undefined){
            fetch(`http://localhost:8080/api/vault/goals/${params.goalsId}`, {
                headers: {
                    Authorization: "Bearer " + auth.user.token,
                }
            })
            .then(response => {
                if(response.ok){
                   return response.json()

                } else {
                    console.log(`unexpected response status code: ${response.status}`)
                }
            })
            .then(targetGoal => {
                setAppUserId(targetGoal.appUserId)
                setCategoryId(targetGoal.categoryId)
                setAmount(targetGoal.amount)
                setStartDate(targetGoal.startDate)
                setEndDate(targetGoal.endDate)

            })
            .catch(error => {
                console.error(error)
            })
        } else{
            resetState()
        }
    }, [auth.user.token, params.goalsId])

    //TODO: Handle Submit and the return form
    //TODO: figure out what needs to be different for a budget vs a savings goal
    const handleSubmit = (evt) => {
        evt.preventDefault()
        const newGoal = {

            appUserId: auth.user.appUserId,
            categoryId: categoryId,
            type: props.type, //props.type
            amount: amount,
            startDate: startDate,
            endDate: endDate,
            //TODO: Check that all of these varialbe names are the right ones
        }

        if (appUserId) {
            newGoal.appUserId = appUserId;
        }

        let url = null;
        let method = null;

        if(params.goalsId !== undefined){
            newGoal.goalsId = params.goalsId;
            url = `http://localhost:8080/api/vault/goal/${params.goalsId}`
            method = "PUT"
        } else {
            url = "http://localhost:8080/api/vault/goal/create"
            method = "POST"
        }

        fetch(url, {
            method, 
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + auth.user.token,
            },
            body: JSON.stringify(newGoal),
        }).then((response) => {
            if(response.ok){
                if(props.type === "spending"){
                    navigate("/budgets")
                } else {
                    navigate("/savings")
                }
                
                //TODO: make this conditional so that it returns to saving or budget depending
            } else {
                response.json().then((errors) => {
                    if(Array.isArray(errors)) {
                        setErrors(errors);
                    } else {
                        setErrors([errors]);
                    }
                    console.log(errors);
                })
            }
        })
    }

    return (
        <ThemeProvider theme = {createTheme()}>
        <Box sx={{display: 'flex', flexDirection: 'row' }}>
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
            // display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'center',
            paddingTop: '80px',
            // paddingLeft: '270px'
          }}
        >
        <Container maxWidth = "sm" sx={{ mt: 6, mb: 4}}>
        <Box component = "form"
        sx={{
            paddingTop: '60px',  
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '16px',  
            // maxWidth: '400px', 
            paddingBottom: '20px',
            paddingLeft: '20px',
            paddingRight: '20px',
            border: "5px solid #05391f",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
         <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FAF9F6",
         backgroundColor: '#05391f',
         padding: '8px',
         borderRadius: '2px',
         border: "2px solid #05391f"}}>
            {params.goalsId
                ? type === 'spending'
                    ? 'Update Budget'
                    : 'Update Savings Goal'
                : type === 'spending'
                ? 'Add A Budget'
                : 'Add A Savings Goal'}
        </Typography>
         <ul>
             {errors.map((error) => (
                 <li key={error}>{error}</li>
             ))}
            </ul>
            <TextField
                id="category-input"
                select
                label="Category"
                
                value = {categoryId}
                onChange={(evt) => setCategoryId(evt.target.value)}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                  }}
            >
            <MenuItem value="1">Emergency Fund</MenuItem>
            <MenuItem value="2">Vacation Fund</MenuItem>
            <MenuItem value="3">Pay Off High-Interest Debt</MenuItem>
            <MenuItem value="4">Spending Money</MenuItem>
            <MenuItem value="5">Home Down Payment</MenuItem>
            <MenuItem value="6">Education</MenuItem>
            <MenuItem value="7">Retirement Fund</MenuItem>
            <MenuItem value="8">Childcare</MenuItem>
            <MenuItem value="9">Home Improvement</MenuItem>
            <MenuItem value="10">Mortgage/Rent</MenuItem>
            <MenuItem value="11">Food</MenuItem>
            <MenuItem value="12">Shopping</MenuItem>
            <MenuItem value="13">Entertainment</MenuItem>
            <MenuItem value="14">Car Payment</MenuItem>
            <MenuItem value="15">Investment Portfolio Growth</MenuItem>
            <MenuItem value="16">Gas</MenuItem>
            <MenuItem value="17">Repairs/Maintenance</MenuItem>
            <MenuItem value="18">Bills/Utilities</MenuItem>
            <MenuItem value="19">Fees</MenuItem>
            <MenuItem value="20">Supplies</MenuItem>
            <MenuItem value="21">Health/Fitness</MenuItem>
            <MenuItem value="22">Personal Care</MenuItem>
            <MenuItem value="23">Pets</MenuItem>
            <MenuItem value="24">Business Spending</MenuItem>
            <MenuItem value="25">Insurance</MenuItem>
            <MenuItem value="26">Income</MenuItem>
            <MenuItem value="27">Misc. Expenses</MenuItem>
            
            </TextField>
            <TextField
                id="amount-input"
                label="Budget Goal"
                type="number"
                value={amount}
                onChange={(evt) => setAmount(evt.target.value)}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                  }}
            />
            <TextField
                id="start-date-input"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(evt) => setStartDate(evt.target.value)}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                  }}
            />
            <TextField
                id="end-date-input"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(evt) => setEndDate(evt.target.value)}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                  }}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{
                    marginTop: '16px',
                    backgroundColor: '#69B45E', 
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#05391F', 
                    },
                  }}
            >
                {params.goalsId
                ? type === 'spending'
                    ? 'Update Budget'
                    : 'Update Savings Goal'
                : type === 'spending'
                ? 'Add Budget'
                : 'Add Savings Goal'}
            </Button>
            
            <Button
             variant="contained" 
             onClick={handleCancelClick}
            sx={{
                // marginTop: '16px',
                backgroundColor: '#05391F', 
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: 'red', 
                },
              }}>
                Cancel
            </Button>
            </Box>
            </Container>
        </Box>
        </Box>
        </ThemeProvider>
    )
}

export default GoalsForm;