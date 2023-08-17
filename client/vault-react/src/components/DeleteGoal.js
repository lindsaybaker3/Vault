import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function ConfirmDeleteGoal(props) {
    const params = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
  
    const [goal, setGoal] = useState(null);

    useEffect(() => {
        const targetGoal = props.goaloals.find(goal => goal.id === parseInt(params.id))
        if (targetGoal !== undefined) {
          setGoal({...targetGoal})
        } else {
          navigate('/not-found')
        }
      }, [props.goals, params.id, navigate])

    const handleDelete = () => {
        fetch(`http://localhost:8080//api/vault/goal/${params.id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + auth.user.token,
          },
        }).then((response) => {
          if (response.ok) {
            navigate("/user/:userId/savings");
            props.loadGoals();
          } else {
            console.log(`Unexpected response status code: ${response.status}`);
          }
        });
      };
    
      if (goal === null) {
        return null;
      }
    
      return (
        <>
          <h2>Confirm Delete</h2>
          <p>Delete this Goal?</p>
          <ul>
            <li>Category: {goal.categoryName}</li>
          </ul>
          <button onClick={handleDelete}>Delete</button>
          <Link to="/user/:userId/savings">Cancel</Link>
        </>
      );
    }
    
export default ConfirmDeleteGoal;

