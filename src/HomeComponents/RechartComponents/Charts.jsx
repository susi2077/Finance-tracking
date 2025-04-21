import React, { useContext, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  CartesianGrid,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { CategoryCard } from "../CategoryCard";
import TrendCharts from "./TrendChart";
import AreaCharts from "./AreaChart.jsx";
import { getCurrencySymbol } from "../../currencyUtils.js";
import MyContext from "../../Context.jsx";

const Charts = ({ filteredTransactions, activeType, activeChart }) => {
  const { userData } = useContext(MyContext);
  let pieDatas = [];
  // console.log("The transaction are:", filteredTransactions);
  // Sample data for the pie chart

  const data = filteredTransactions.filter((data) => data.type === activeType);
  // console.log(data);

  data.forEach((d) => {
    const existingCategory = pieDatas.find(
      (item) => item.category === d.category
    );
    if (existingCategory) {
      existingCategory.total += d.amount;
    } else {
      pieDatas.push({ category: d.category, total: d.amount });
    }
  });

  // Custom colors for each pie segment
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Custom rendering for the label
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calculate total expenses for percentage calculation
  const totalExpenses = pieDatas.reduce((sum, item) => sum + item.total, 0);

  // Add percentage to each category
  pieDatas = pieDatas.map((item) => ({
    ...item,
    percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0,
  }));

  // Sort by total expense (highest first)
  pieDatas.sort((a, b) => b.total - a.total);

  const formatTooltip = (value) => {
    return [
      `${getCurrencySymbol(
        userData?.preferredCurrency
      )} ${value.toLocaleString()}`,
      "Total",
    ];
  };

  return (
    <div className="w-full h-96 p-4 flex">
      {/* <h2 className="text-xl font-bold mb-4">Sales Distribution by Product</h2> */}

      {activeChart === "pie" ? (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={pieDatas}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="total"
              nameKey="category"
            >
              {pieDatas.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `${getCurrencySymbol(
                  userData?.preferredCurrency
                )}  ${value?.toFixed(3)}`
              }
              labelFormatter={(value) =>
                `${getCurrencySymbol(
                  userData?.preferredCurrency
                )}  ${value?.toFixed(3)}`
              }
            />
            <Legend
              iconType="rect"
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              dataKey="category"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : activeChart === "bar" ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={pieDatas}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 70,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) =>
                `${getCurrencySymbol(userData?.preferredCurrency)} ${value}`
              }
            />
            <Tooltip
              formatter={formatTooltip}
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
            />
            <Legend />
            <Bar dataKey="total" name={activeType + " " + "Amount"}>
              {pieDatas.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : activeChart === "line" ? (
        <TrendCharts
          filteredTransactions={filteredTransactions}
          activeType={activeType}
        />
      ) : (
        <AreaCharts
          filteredTransactions={filteredTransactions}
          activeType={activeType}
        />
      )}

      <div className="flex flex-col gap-1 w-full py-4 overflow-y-auto">
        {pieDatas.map((item, index) => (
          <CategoryCard
            key={`category-${index}`}
            category={item.category}
            total={item.total}
            percentage={item.percentage.toFixed(2)}
            color={COLORS[index % COLORS.length]}
            activeType={activeType}
            currency={getCurrencySymbol(userData?.preferredCurrency)}
          />
        ))}
      </div>
    </div>
  );
};

export default Charts;
