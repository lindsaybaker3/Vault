import React, { useContext, useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
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
    .then(response => response.json())
    .then(payload => setTransactions(payload))
    .catch((error) => console.error("error Fetching goals:", error))
  };
  
  useEffect(() => {
    loadTransactions();
  }, []);

  console.log(transactions);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed, so January is 0
  
  const filteredByGoalType = transactions?.filter(transaction => transaction.goalType === "spending")
 
  const filteredTransactions = filteredByGoalType.filter(transaction => {
    const transactionDate = new Date(transaction.transactionDate);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();
    
    
    return (
      transactionYear === currentYear && 
      transactionMonth === currentMonth
    )
  });
  
  const dateToTotalMap = {};
  let cumulativeTotal = 0;
  
  filteredTransactions.forEach(transaction => {
    const transactionDate = new Date(transaction.transactionDate);
    const formattedDate = transactionDate.toISOString().substr(0, 10); // Get YYYY-MM-DD
    cumulativeTotal += transaction.amount;
  
    if (!dateToTotalMap[formattedDate]) {
      dateToTotalMap[formattedDate] = cumulativeTotal;
    }
  });
  
  const formattedData = Object.keys(dateToTotalMap).map(date => ({
    date,
    amount: dateToTotalMap[date],
  }));
     
  console.log(filteredTransactions)

  
  
    return (
      <React.Fragment>
        <h4>Current Balance: ${cumulativeTotal}</h4>
        <ResponsiveContainer>
          <LineChart
            data={formattedData}
            margin={{
              top: 10,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            >
              <Label
                angle={270}
                position="left"
                style={{
                  textAnchor: 'middle',
                  fill: theme.palette.text.primary,
                  ...theme.typography.body1,
                }}
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