import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";

function DeleteGoal() {
  const params = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState([])
  const auth = useContext(AuthContext);
  const [goal, setGoal] = useState("");
 
  const fetchGoal = () => {
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

useEffect(() => {
if(!auth?.user?.token){
    return;
  }else {
    fetchGoal()
  }
}, [params.goalsId])

const handleDelete = () => {
    fetch(`http://localhost:8080/api/vault/goal/${params.goalsId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    }).then((response) => {
      if (response.ok) {
        navigate("/budgets");
      } else {
        console.log(`Unexpected response status code: ${response.status}`);
      }
    });
  };

  if (goal === null) {
    return null;
  }

  const getUsernameWithoutDomain = (username) => {
    const parts = username.split("@");
    return parts[0];
  };

  const message = `Hey ${getUsernameWithoutDomain(auth.user.username)
    .charAt(0)
    .toUpperCase()}${getUsernameWithoutDomain(auth.user.username).slice(1)}, `;


  return (
      <Box 
      sx = {{
        position: 'absolute',
        top: '50%',
        left: '55%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        
      }}>
      <div className="modal-content">
        <h2 style={{ marginBottom: "20px" }}>Delete this Goal?</h2>
        <p>
          <strong> {message}</strong>
        </p>
        <p>Are you sure you want to delete this goal?</p>
        <p><strong>Amount:</strong> <AmountDisplay amount = {goal.amount} ></AmountDisplay></p>
        <p><strong>Start Date: </strong> <FormattedDate date = {goal.startDate} ></FormattedDate></p>
        <p><strong>End Date: </strong> <FormattedDate date = {goal.endDate} ></FormattedDate></p>
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "red",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#69b45E",
            },
            marginLeft: "65px",
            marginRight: '10px'
          }}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Link to={goal.type === "spending" ? "/budgets" : "/savings"}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#05391F",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#69B45E",
              },
            }}
          >
            Cancel
          </Button>
        </Link>
      </div>
    </Box>
  );
}
    
export default DeleteGoal;

