import { useState, useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import '../style/goalslist.css'

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
    console.log(filteredGoals)

    const addLinkPath = type === "spending" ? "/budgets/add" : "/savings/add"
    return (

        <div className = "card-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {filteredGoals.map((goal, index) => (
                    console.log(goal),
                    console.log(index),
                   <Link to = {`/budgets/${goal.goalsId}`} key = {goal.goalsId} className="card">
                    <h2>{goal.categoryName}</h2>
                   </Link>  
                ))}
                <Link to = {addLinkPath} className = "add=button">
                    Add {type === 'spending' ? "budget" : "saving"}
                </Link>

        </div>

    )
}

export default GoalsList;