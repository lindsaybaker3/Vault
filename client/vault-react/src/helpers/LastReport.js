import React from "react";

const LastReport = () => {
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

  if (!lastReportUrl) {
    return <div>No reports available.</div>;
  }

  return (
    <div>
      <a href={lastReportUrl} target="_blank" rel="noopener noreferrer">
        <button>Download.pdf file</button>
      </a>
    </div>
  );
};

export default LastReport;
