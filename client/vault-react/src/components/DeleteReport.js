import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AmountDisplay from "../helpers/AmountDisplay";
import FormattedDate from "../helpers/FormattedDate";

function ConfirmDelete() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reportId = isNaN(params.reportId) ? null : parseInt(params.reportId);
    fetch(`http://localhost:8080/api/vault/report/${reportId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Report not found");
        }
      })
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/not-found");
      });
  }, [params.reportId]);

  const handleDelete = () => {
    const reportId = isNaN(params.reportId) ? null : parseInt(params.reportId);
    fetch(`http://localhost:8080/api/vault/transaction/${reportId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate("/reports");
        } else {
          console.log(`Unexpected response status code: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting transaction:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!report) {
    return <p>Transaction not found.</p>;
  }

  return (
    <>
      <div className="delete-report">
        <h2>Confirm Delete</h2>
        <p>Delete this Report?</p>
        <ul>
          <li>Start Range Date: {report.startDate}</li>
          <li>Start End Date: {report.endDate}</li>
          <li>Goal Type: {report.goalType}</li>
          <li>Report: {report.reportUrl}</li>
        </ul>
        <button onClick={handleDelete}>Delete Report</button>{" "}
        <Link to="/reports">Cancel</Link>
      </div>{" "}
      {/* Closing tag for the wrapping div */}
    </>
  );
}

export default ConfirmDelete;
