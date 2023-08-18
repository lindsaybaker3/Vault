import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function ConfirmDeleteGoal() {
    const params = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
  
    const [goal, setGoal] = useState(null);

   useEffect(()=> {
    fetch(`http://localhost:8080/api/goals/${params.goalsId}`, {
      headers: {
          Authorization: "Bearer " + auth.user.token,
      }
    })
    .then(response => {
      if(response.ok){
        response.json()
        .then(setGoal)
      } else {
        navigate('/*')
      }
    })
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
    
      return (
        <>
          <h2>Confirm Delete</h2>
          <p>Delete this Goal?</p>
          <ul>
            <li>Category: {goal.categoryName}</li>
          </ul>
          <button onClick={handleDelete}>Delete</button>
          <Link to="/budgets">Cancel</Link>
        </>
      );
    }
    
export default ConfirmDeleteGoal;

