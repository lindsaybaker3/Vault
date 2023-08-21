import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Container } from "@mui/system";
import LastReport from "../helpers/LastReport";

import DrawerComponent from "./Drawer";
import {
  Box,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { Tab } from "@mui/base";
// ------

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

  const downloadFileUrl = (url) => {
    const fileName = url;
  };

  const getUsernameWithoutDomain = (username) => {
    const parts = username.split("@");
    return parts[0];
  };

  const message = `Hey ${getUsernameWithoutDomain(auth.user.username)
    .charAt(0)
    .toUpperCase()}${getUsernameWithoutDomain(auth.user.username).slice(1)}, `;

  const getLastReportUrl = () => {
    const reportContext = require.context("../reports", false, /\.pdf$/);
    const reportFiles = reportContext.keys();

    if (reportFiles.length > 0) {
      const lastReportPath = reportFiles[reportFiles.length - 1];
      return reportContext(lastReportPath);
    }

    return null;
  };

  const lastReportUrl = getLastReportUrl();

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <DrawerComponent />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                paddingTop: "64px",
              }}
            >
              <div>
                {reports.length === 0 ? (
                  <p>
                    {message}
                    <br></br>
                    No reports available . <br></br>Let's create a report.
                  </p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Start Range Date</th>
                        <th>Range End Date</th>
                        <th>Goal Type</th>
                        <th>Report URL</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.reportId}>
                          <td>{report.startDate}</td>
                          <td>{report.endDate}</td>
                          <td>{report.goalType}</td>
                          {/* <td>
                            <a
                              href={lastReportUrl} // Use lastReportUrl here
                              download="Example-PDF-document"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <button>Download.pdf file</button>
                            </a>
                        
                          </td> */}
                          <td>
                            <LastReport />{" "}
                            {/* Place LastReport component here */}
                          </td>
                          <td>
                            {auth.user && (
                              <Link to={`/delete/${report.reportId}`}>
                                Delete
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <Link to="/report/add">
                  <button>&nbsp;&nbsp;Create Report</button>
                </Link>
              </div>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ReportList;
