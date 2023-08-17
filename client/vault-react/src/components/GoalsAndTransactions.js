import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";


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

    //TODO: Do on success and create the actual return statement
}
export default GoalsAndTransactions;