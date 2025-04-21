import { useState, useEffect, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MyContext from "../../Context";
import { getCurrencySymbol } from "../../currencyUtils";

const TrendCharts = ({ filteredTransactions, activeType }) => {
  const [trendData, setTrendData] = useState([]);
  const { userData } = useContext(MyContext);

  useEffect(() => {
    // Filter transactions by the active type
    const data = filteredTransactions.filter(
      (trans) => trans.type === activeType
    );

    // Create date-based trend data
    const dateMap = new Map();

    // Assuming each transaction has a date property
    data.forEach((transaction) => {
      if (!transaction.date) return;

      // Extract just the date part (YYYY-MM-DD)
      const dateStr = transaction.date.split("T")[0];

      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, dateMap.get(dateStr) + transaction.amount);
      } else {
        dateMap.set(dateStr, transaction.amount);
      }
    });

    // Create sorted data for the trend graph
    const sortedDates = Array.from(dateMap.keys()).sort();
    const preparedData = sortedDates.map((date) => ({
      date,
      amount: dateMap.get(date),
    }));

    setTrendData(preparedData);
  }, [filteredTransactions, activeType]);

  // Custom colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Format tooltip
  const formatTooltip = (value) => {
    return [`$${value.toLocaleString()}`, "Amount"];
  };

  return (
    <div className="h-68 mt-10 w-full">
      {trendData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(tick) => {
                const date = new Date(tick);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(tick) =>
                `${getCurrencySymbol(userData?.preferredCurrency)} ${tick}`
              }
            />
            <Tooltip
              formatter={(value) =>
                `${getCurrencySymbol(
                  userData?.preferredCurrency
                )}  ${value.toLocaleString()}`
              }
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={COLORS[0]}
              activeDot={{ r: 8 }}
              name={`${activeType} Amount`}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <p className="text-gray-500">No data available for trend analysis</p>
        </div>
      )}
    </div>
  );
};

export default TrendCharts;
