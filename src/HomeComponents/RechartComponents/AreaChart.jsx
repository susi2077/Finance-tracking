import { useState, useEffect, useContext } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MyContext from "../../Context";
import { getCurrencySymbol } from "../../currencyUtils";

const AreaCharts = ({ filteredTransactions, activeType }) => {
  const [areaData, setAreaData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const { userData } = useContext(MyContext);

  useEffect(() => {
    // Filter transactions by the active type
    const data = filteredTransactions.filter(
      (trans) => trans.type === activeType
    );

    // Create date-based trend data
    const dateMap = new Map();
    const categorySet = new Set();
    const categoryDateMap = new Map();

    // Collect all unique categories
    data.forEach((transaction) => {
      if (transaction.category) {
        categorySet.add(transaction.category);
      }
    });

    // Process transactions by date and category
    data.forEach((transaction) => {
      if (!transaction.date) return;

      // Extract just the date part (YYYY-MM-DD)
      const dateStr = transaction.date.split("T")[0];
      const category = transaction.category || "Uncategorized";

      // Add to total by date
      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, dateMap.get(dateStr) + transaction.amount);
      } else {
        dateMap.set(dateStr, transaction.amount);
      }

      // Add to category by date mapping
      const key = `${dateStr}-${category}`;
      if (categoryDateMap.has(key)) {
        categoryDateMap.set(key, categoryDateMap.get(key) + transaction.amount);
      } else {
        categoryDateMap.set(key, transaction.amount);
      }
    });

    // Create sorted data for the area chart
    const sortedDates = Array.from(dateMap.keys()).sort();

    // Prepare data for overall area chart
    const preparedData = sortedDates.map((date) => ({
      date,
      amount: dateMap.get(date),
    }));

    // Prepare data for stacked area chart by category
    const categories = Array.from(categorySet);
    const categoryPreparedData = sortedDates.map((date) => {
      const dataPoint = { date };

      categories.forEach((category) => {
        const key = `${date}-${category}`;
        dataPoint[category] = categoryDateMap.get(key) || 0;
      });

      return dataPoint;
    });

    setAreaData(preparedData);
    setCategoryData({
      data: categoryPreparedData,
      categories: Array.from(categorySet),
    });
  }, [filteredTransactions, activeType]);

  // Custom colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
    "#ffc658",
  ];

  return (
    <div className="h-72 mt-4 w-full">
      {/* Stacked Area Chart by Category */}
      {categoryData.data && categoryData.data.length > 0 && (
        <div className="mt-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={categoryData.data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                formatter={(value) => `${getCurrencySymbol(userData?.preferredCurrency)} ${value.toLocaleString()}`}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString();
                }}
              />
              <Legend />
              {categoryData.categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AreaCharts;
