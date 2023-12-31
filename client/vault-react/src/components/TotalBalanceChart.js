import React, { useContext, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import AuthContext from "../context/AuthContext";

export default function TotalBalanceChart() {
  const auth = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const theme = useTheme();

  const loadTransactions = () => {
    fetch("http://localhost:8080/api/vault/transactions", {
      headers: {
        Authorization: "Bearer " + auth.user.token,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          auth.logout();
        }
        return response.json();
      })
      .then((payload) => setTransactions(payload))
      .catch((error) => console.error("error Fetching goals:", error));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed, so January is 0

  const filteredByGoalType = transactions?.filter(
    (transaction) => transaction.goalType === "spending"
  );

  const filteredTransactions = filteredByGoalType.filter((transaction) => {
    const transactionDate = new Date(transaction.transactionDate);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();

    return transactionYear === currentYear && transactionMonth === currentMonth;
  });

  const dateToTotalMap = {};
  let cumulativeTotal = 0;

  const monthStartDate = new Date(currentYear, currentMonth, 1);
  const formattedStart = monthStartDate.toISOString().substring(0, 10);
  dateToTotalMap[formattedStart] = 0;

  filteredTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.transactionDate);
    const formattedDate = transactionDate.toISOString().substr(0, 10); // Get YYYY-MM-DD

    if (dateToTotalMap[formattedDate]) {
      // If the formatted date already exists in the map, update the amount
      dateToTotalMap[formattedDate] += transaction.amount;
    } else {
      // If the formatted date doesn't exist, add a new entry to the map
      dateToTotalMap[formattedDate] = transaction.amount;
    }
  });

  const sortedDates = Object.keys(dateToTotalMap).sort();

  const formattedData = sortedDates.map((date) => {
    cumulativeTotal += dateToTotalMap[date];
    return {
      date,
      amount: cumulativeTotal,
    };
  });

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC", // Set to UTC to avoid time zone discrepancies
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <React.Fragment>
      <h4>Current Balance: {formatCurrency(cumulativeTotal)}</h4>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 16,
            bottom: 0,
            left: 32,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            tickFormatter={formatDate}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            dataKey="amount"
            domain={[0, cumulativeTotal]}
            tickCount={Math.ceil(cumulativeTotal / 100)}
            tickFormatter={formatCurrency}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
              offset={26}
            >
              Total Balance
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
