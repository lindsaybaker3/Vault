import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Form = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [errors, setErrors] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goalType, setGoalType] = useState("");

  const resetState = () => {
    setStartDate("");
    setEndDate("");
    setGoalType("");
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newReport = {
      startDate: startDate,
      endDate: endDate,
      goalType: goalType,
    };

    fetch("http://localhost:8080/api/vault/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + auth.user.token,
      },
      body: JSON.stringify(newReport),
    }).then((response) => {
      if (response.ok) {
        navigate("/reports");
        resetState();
      } else {
        response.json().then((errors) => {
          if (Array.isArray(errors)) {
            setErrors(errors);
          } else {
            setErrors([errors]);
          }
        });
      }
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
      <fieldset>
        <label htmlFor="startdate-input">Start Date: </label>
        <input
          id="startdate-input"
          type="date"
          value={startDate}
          onChange={(evt) => setStartDate(evt.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="enddate-input">End Date: </label>
        <input
          id="enddate-input"
          type="date"
          value={endDate}
          onChange={(evt) => setEndDate(evt.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="goal-input">Goal Type:</label>
        <select
          id="goal-input"
          value={goalType}
          onChange={(evt) => setGoalType(evt.target.value)}
        >
          <option disabled value="">
            Select a Goal type
          </option>
          <option value="spending">Budgets</option>
          <option value="saving">Saving</option>
        </select>
      </fieldset>

      <div className="group-button">
        <Link className="btn btn-warning" to="/reports">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary">
          Create Report
        </button>
      </div>
    </form>
  );
};

export default Form;
