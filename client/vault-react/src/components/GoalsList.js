import { useState, useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const GoalsList = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);

   
    const loadGoals = () => {
        fetch("http://localhost:8080/api/vault/goals")
        .then(response => response.json())
        .then(payload => setGoals(payload))
    }

    useEffect(loadGoals, [])

    return (
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    
                </tr>

            </thead>
            <tbody>
                {goals.map(goal => <tr key = {goal.goalsId}>
                    <td>{goal.categoryName}</td>
                    {/* TODO: get category name in here */}
                    <td>
                        { auth.user ? <Link to = {`edit/${goal.goalsId}`}>Edit</Link> : <Link to = "/login">Login To View Details</Link>}
                    </td>


                </tr>)}

            </tbody>


        </table>
    )
}

export default GoalsList;