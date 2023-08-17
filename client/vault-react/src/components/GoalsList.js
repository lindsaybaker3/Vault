import { useState, useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

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
        .catch((error) => console.error("error Fetching questions:", error))
    }

    useEffect(loadGoals, [])

    const filteredGoals = goals.filter(goal => goal.type === type);
        
    

    return (
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    
                </tr>

            </thead>
            <tbody>
                {filteredGoals.map(goal => <tr key = {goal.goalsId}>
                    <td>{goal.categoryName}</td>
                    
                    <td>
                        <Link to = {`edit/${goal.goalsId}`}>Edit</Link>
                        <Link to = {`/budgets/${goal.goalsId}`}>View Goal</Link>
                    </td>


                </tr>)}

            </tbody>


        </table>
    )
}

export default GoalsList;