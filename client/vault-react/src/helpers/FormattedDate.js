import React from "react";

const FormattedDate = ({ date }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formattedDate = formatDate(date);

  return <span>{formattedDate}</span>;
};

export default FormattedDate;
