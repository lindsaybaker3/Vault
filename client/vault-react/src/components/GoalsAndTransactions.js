import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";


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

return (
    <div className = "Goals-details-container">
        <div className = "goal-section">
            <table>
                <thead>
                    <tr>
                        <th className = "goal-header">{goal.categoryName}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className = "goal-amount">{goal.amount}</td>
                        <td className = "goal-startDate">{goal.startDate}</td>
                        <td className = "goal-endDate">{goal.endDate}</td>
                        <td className="goal-CurrentBalance">{goal.currentBalance}</td>
                        <Link to = {`/budgets/edit/${goal.goalsId}`}>Edit</Link>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className = "transactions-section">
            {goal?.transactionsList?.map((transaction) => (
                <div key = {transaction.transactionId} className = "transaction">
                    <span className = "transaction-date">{transaction.transactionDate}</span>
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-amount">{transaction.amount}</span>
                </div>
            ))}
        </div>
    </div>
)

    //TODO: Do on success and create the actual return statement
}
export default GoalsAndTransactions;