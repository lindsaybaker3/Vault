import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Container } from "@mui/system";
import AWS from "aws-sdk";
import DrawerComponent from "./Drawer";
import { Modal, styled, tableCellClasses } from "@mui/material";
import {
  Box,
  Button,
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
import FormattedDate from "../helpers/FormattedDate";
// ------

const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const region = process.env.REACT_APP_AWS_REGION;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const s3 = new AWS.S3();

const ReportList = () => {
  const params = useParams();
  const auth = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [downloadLink, setDownloadLink] = useState("");
  const [reportsByUser, setReportsByUser] = useState([]);

  const loadReports = () => {
    fetch("http://localhost:8080/api/vault/reports", {
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if(response.status === 403){
          auth.logout()
        }
        return response.json()
      })
      .then((payload) => {
        if (payload) {
          setReports(payload);
        }
      })
      .catch((error) => console.error("error Fetching Reports", error))
  };

  useEffect(() => {
    loadReports();
  }, []);

  const getUsernameWithoutDomain = (username) => {
    const parts = username.split("@");
    return parts[0];
  };

  const message = `Hey ${getUsernameWithoutDomain(auth.user.username)
    .charAt(0)
    .toUpperCase()}${getUsernameWithoutDomain(auth.user.username).slice(1)}, `;

  const handleDownload = async (reportUrl) => {
    try {
      const response = await fetch(reportUrl, {
        headers: {
          Authorization: "Bearer " + auth.user.token,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao baixar o arquivo");
      }
      const url = window.URL.createObjectURL(new Blob([await response.blob()]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (downloadLink) {
        URL.revokeObjectURL(downloadLink);
      }
    };
  }, [downloadLink]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#05391F",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

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
            paddingTop: "64px",
            border: "1px solid #000",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                paddingBottom: "45px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Grid container>
                <Grid item xs={10}>
                  <h1>Reports</h1>
                </Grid>
                <Grid item xs={2} sx={{ paddingTop: "11px" }}>
                  <Link to="/report/add">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        // marginTop: "16px",
                        backgroundColor: "#05391F",
                        color: "#FFFFFF",
                        "&:hover": {
                          backgroundColor: "#69B45E",
                        },
                      }}
                    >
                      Add Report
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Box>
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
                    <br />
                    No reports available. <br />
                    Let's create a report.
                  </p>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Start Range Date</StyledTableCell>
                          <StyledTableCell>Range End Date</StyledTableCell>
                          <StyledTableCell>Goal Type</StyledTableCell>
                          <StyledTableCell>Report URL</StyledTableCell>
                          <StyledTableCell>Delete</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reports?.map((report) => (
                          <TableRow key={report.reportId}>
                            <StyledTableCell>
                              <FormattedDate date={report.startDate} />
                            </StyledTableCell>
                            <StyledTableCell>
                              <FormattedDate date={report.endDate} />
                            </StyledTableCell>
                            <StyledTableCell>{report.goalType}</StyledTableCell>
                            <StyledTableCell>
                              {auth.user.token && (
                                <a
                                  href={report.reportUrl}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(report.reportUrl);
                                  }}
                                  style={{
                                    display: "block",
                                    backgroundColor: "#05391F",
                                    color: "#FFFFFF",
                                    padding: "8px 16px",
                                    textAlign: "center",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    "&:hover": {
                                      backgroundColor: "#69B45E",
                                    },
                                  }}
                                >
                                  Download
                                </a>
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {auth.user && (
                                <Link to={`/deleteReport/${report.reportId}`}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      // marginTop: '16px',
                                      backgroundColor: "red",
                                      color: "#FFFFFF",
                                      "&:hover": {
                                        backgroundColor: "#69B45E",
                                      },
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Link>
                              )}
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default ReportList;

// return (
//   <ThemeProvider theme={createTheme()}>
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       <DrawerComponent />
//       <Box
//         component="main"
//         sx={{
//           backgroundColor: (theme) =>
//             theme.palette.mode === "light"
//               ? theme.palette.grey[100]
//               : theme.palette.grey[900],
//           flexGrow: 1,
//           height: "100vh",
//           overflow: "auto",
//         }}
//       >
//         <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "16px",
//               paddingTop: "64px",
//             }}
//           >
//             <div>
//               {reports.length === 0 ? (
//                 <p>
//                   {message}
//                   <br></br>
//                   No reports available . <br></br>Let's create a report.
//                 </p>
//               ) : (
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Start Range Date</th>
//                       <th>Range End Date</th>
//                       <th>Goal Type</th>
//                       <th>Report URL</th>
//                       <th>Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {reports.map((report) => (
//                       <tr key={report.reportId}>
//                         <td>{report.startDate}</td>
//                         <td>{report.endDate}</td>
//                         <td>{report.goalType}</td>

//                         <td>
//                           {auth.user.token && (
//                             <a
//                               href={report.reportUrl}
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 handleDownload(report.reportUrl);
//                               }}
//                             >
//                               Download
//                             </a>
//                           )}
//                         </td>
//                         <td>
//                           {auth.user && (
//                             <Link
//                               to={`/delete/${report.reportId}`}
//                               // style={{ color: "red" }}
//                             >
//                               Delete
//                             </Link>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//               <Link to="/report/add">
//                 <button>&nbsp;&nbsp;Create Report</button>
//               </Link>
//             </div>
//           </Box>
//         </Container>
//       </Box>
//     </Box>
//   </ThemeProvider>
// );
// };

// export default ReportList;
