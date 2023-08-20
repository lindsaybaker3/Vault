import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const ReportList = () => {
  const auth = useContext(AuthContext);
  const [reports, setReports] = useState([]);

  const loadReports = () => {
    fetch("http://localhost:8080/api/vault/reports", {
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => response.json())
      .then((payload) => {
        if (payload) {
          setReports(payload);
        }
      });
  };

  useEffect(() => {
    loadReports();
  }, []);

  console.log(auth, "passou aqui");
  console.log(auth.user, "passou aqui 2");

  const getUsernameWithoutDomain = (username) => {
    const parts = username.split("@");
    return parts[0];
  };

  return (
    <div>
      <p>{`Hey ${getUsernameWithoutDomain(
        auth.user.username
      )}, here are your reports:`}</p>
      <table>
        <thead>
          <tr>
            {/* <th>ID</th>
            <th>App User ID</th> */}
            <th>Start Range Date</th>
            <th>Range End Date</th>
            <th>Goal Type</th>
            <th>Report URL</th>
            <th>Delete?</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.reportId}>
              {/* <td>{report.reportId}</td>
              <td>{report.appUserId}</td> */}
              <td>{report.startDate}</td>
              <td>{report.endDate}</td>
              <td>{report.goalType}</td>
              <td>
                <a
                  href={report.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              </td>
              <td>
                {auth.user && (
                  <Link to={`/delete/${report.reportId}`}>Delete</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>
        {" "}
        <Link to="/report/add">Create Report</Link>
      </button>
    </div>
  );
};

export default ReportList;
