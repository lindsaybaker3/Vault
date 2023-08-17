import React from "react";

function ConvertDate(dateString = "yyyy-mm-dd") {
  if (dateString !== null) {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  } else {
    return;
  }
}

export default ConvertDate;
