import { useState, useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import '../style/goalslist.css'
import { Box, Button } from "@mui/material";

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
        <Box
        className="card-container"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px', // Adjust the gap between cards
          flexWrap: 'wrap', // Allow cards to wrap when there's limited space
        }}
      >
          {filteredGoals.map((goal, index) => (
        <Link key={goal.goalsId} to={`/budgets/${goal.goalsId}`} className="card">
          <Box
            sx={{
              backgroundColor: '#f5f5f5', // Adjust the background color
              padding: '16px',
              borderRadius: '8px',
              width: '200px', // Adjust the card width
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            <h2>{goal.categoryName}</h2>
          </Box>
        </Link>
      ))}
       <Link href={addLinkPath} className="add-button">
        <Link to = {addLinkPath} className = "add=button">
          Add {type === 'spending' ? 'budget' : 'saving'}
        </Link>
      </Link>
    </Box>
  );
};

        // <div className = "card-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        //         {filteredGoals.map((goal, index) => (
        //            <Link to = {`/budgets/${goal.goalsId}`} key = {goal.goalsId} className="card">
        //             <h2>{goal.categoryName}</h2>
        //            </Link>  
        //         ))}
        //         <Link to = {addLinkPath} className = "add=button">
        //             Add {type === 'spending' ? "budget" : "saving"}
        //         </Link>

        // </div>

//     )
// }

export default GoalsList;