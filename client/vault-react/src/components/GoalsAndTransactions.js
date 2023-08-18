import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import ConfirmDeleteGoal from "./DeleteGoal";
import DeleteGoal from "./DeleteGoal";
import "../style/goalsandtransactions.css"


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

const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

return (
    <div className = "Goals-details-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className = "goal-section">
            <table>
                <thead>
                    <tr>
                        <th className = "goal-header" colSpan={"2"}>{goal.categoryName}</th>
                        <th className="goal-currentbalance">Current Balance: {goal.currentBalance}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td className="goal-dates" colSpan="2">
                            {goal.startDate} - {goal.endDate}
                    </td>
                        <td className = "goal-amount">Budget: {goal.amount}</td>

                    </tr>
                    <tr>
                        <td colSpan={"3"}>
                        <Link to = { goal.type === "spending" ? `/budgets/edit/${goal.goalsId}` : `/savings/edit/${goal.goalsId}`}>Edit</Link>
                        <Link to="#" onClick = {handleDeleteClick}>Delete</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className = "transactions-section ">
            {goal?.transactionsList?.map((transaction) => (
                <div key = {transaction.transactionId} className = "transaction">
                    <span className = "transaction-date">{transaction.transactionDate}</span>
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-amount">{transaction.amount}</span>
                </div>
            ))}
        </div>
        <div className = "current-balance-line">
            Total: {goal.currentBalance}
                    </div>
        {showDeleteModal && (
        <DeleteGoal
          goal={goal} // Pass the goal data to the confirmation modal
          onClose={() => setShowDeleteModal(false)} // Close modal callback
        />
      )}
    </div>
)

    //TODO: Do on success and create the actual return statement
}
export default GoalsAndTransactions;