import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";
import { Button } from "@mui/base";
import AmountDisplay from "../helpers/AmountDisplay";

function DeleteGoal() {
  const params = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState([])
  const auth = useContext(AuthContext);
  const [goal, setGoal] = useState("");
 
  
  //TODO: may need to add more pieces of state but this is what i have right now

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

      console.log(goal);


      return (
        <Box sx = {{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
        <div className="modal-content">
          <h2>You are about to delete {goal.categoryName}</h2>
          <p>Are you sure you want to delete this goal?</p>
          <p>Amount: <AmountDisplay amount = {goal.amount} ></AmountDisplay></p>
          <p>Start Date: {goal.startDate}</p>
          <p>End Date: {goal.endDate}</p>
          <Button
            variant="contained"
            style={{ backgroundColor: 'red', color: 'white', marginLeft: '100px' }}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Link to={goal.type === "spending" ? "/budgets" : "/savings"}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#05391F', color: 'white', marginLeft: '10px'}}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </Box>

      );
    }
    
export default DeleteGoal;

