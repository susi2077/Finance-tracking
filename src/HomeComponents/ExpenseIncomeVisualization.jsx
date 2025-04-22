import React, { useContext, useEffect, useState } from "react";
import MyContext from "../Context";
import {
  ChevronRight,
  ChevronLeft,
  CreditCard,
  CircleDollarSign,
  Scale,
  PieChartIcon,
  BarChartIcon,
  LineChartIcon,
  Activity,
  Loader,
} from "lucide-react";
import axios from "axios";
import endpoint from "../api";
import Charts from "./RechartComponents/Charts";
import { getCurrencySymbol, getCurrencyCode,currencyConverter } from "../CurrencyUtils";

const ExpenseIncomeVisualization = () => {
  const {
    transactions,
    currentMonth,
    userData,
    setCurrentMonth,
    setTransactions,
  } = useContext(MyContext);
  
  const [activeType, setActiveType] = useState("expense");
  const [activeChart, setActiveChart] = useState("pie");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [preferredCurrency, setPreferredCurrency] = useState();

  const userId = localStorage.getItem("userId");

  // Initialize current month to today's month
  useEffect(() => {
    if (!currentMonth) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      setCurrentMonth(`${year}-${month.toString().padStart(2, "0")}`);
    }
  }, [currentMonth, setCurrentMonth]);

  const fetchAllTransaction = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        console.error("No user ID available, cannot fetch transactions");
        setIsLoading(false);
        return;
      }
      
      console.log("Fetching transactions for user:", userId);
      const response = await axios.get(
        `${endpoint}/transaction/get-all-transaction/${userId}`, 
        {
          headers: {
            'ngrok-skip-browser-warning': 'true' 
          }
        }
      );

      if (response.data && response.data.transactions) {
        setTransactions(response.data.transactions);
        setPreferredCurrency(response.data.preferredCurrency)
        console.log(`Set ${response.data.transactions.length} transactions`);
      } else {
        console.log("No transactions found in response");
        setTransactions([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransaction();
  }, [userId]);

  // Get month and year from currentMonth string
  const getMonthDetails = () => {
    if (!currentMonth) return { monthNum: 1, year: 2025 };

    const [year, monthStr] = currentMonth.split("-");
    return {
      monthNum: parseInt(monthStr),
      year: parseInt(year),
    };
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const { monthNum, year } = getMonthDetails();

    let newMonth, newYear;

    if (monthNum === 1) {
      newMonth = 12;
      newYear = year - 1;
    } else {
      newMonth = monthNum - 1;
      newYear = year;
    }

    setCurrentMonth(`${newYear}-${newMonth.toString().padStart(2, "0")}`);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const { monthNum, year } = getMonthDetails();

    let newMonth, newYear;

    if (monthNum === 12) {
      newMonth = 1;
      newYear = year + 1;
    } else {
      newMonth = monthNum + 1;
      newYear = year;
    }

    setCurrentMonth(`${newYear}-${newMonth.toString().padStart(2, "0")}`);
  };

  // Format the current month for display
  const formattedCurrentMonth = () => {
    if (!currentMonth) return "";

    const { monthNum, year } = getMonthDetails();
    const date = new Date(year, monthNum - 1, 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    if (transactions && transactions.length > 0 && preferredCurrency) {
      console.log("Processing transactions for visualization:", transactions.length);
      console.log("User preferred currency:", preferredCurrency);
      
      const convertedTransactions = transactions.map((transaction) => {
        // Make sure the transaction amount is a number
        const originalAmount = parseFloat(transaction.amount);
        
        // Make sure we have valid currency codes
        const fromCurrency = getCurrencyCode(transaction.currency) || 'NPR';
        const toCurrency = getCurrencyCode(preferredCurrency) || 'NPR';
        
        // Log the conversion details for debugging
        console.log(`Visualization conversion: ${originalAmount} ${fromCurrency} to ${toCurrency}`);
        
        const convertedAmount = currencyConverter(
          originalAmount,
          fromCurrency,
          toCurrency
        );
        
        console.log(`Result: ${convertedAmount}`);
        
        return {
          ...transaction,
          amount: convertedAmount,
          // Store original amount and currency for reference
          originalAmount: originalAmount,
          originalCurrency: fromCurrency
        };
      });

      // Filter transactions by current month
      const filTransaction = convertedTransactions.filter((transaction) => {
        if (!currentMonth) return true;
        return transaction.date.startsWith(currentMonth);
      });
      
      console.log(`Filtered to ${filTransaction.length} transactions for visualization`);
      setFilteredTransactions(filTransaction);
    } else {
      console.log("No transactions to process for visualization or missing user currency preferences");
      setFilteredTransactions([]);
    }
  }, [transactions, userData, currentMonth]);

  // Calculate totals
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = income - expenses;

  return (
    <div className="min-h-screen px-6 py-3 w-full relative">
      <div className="max-w-screen-2xl">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div className="flex items-center justify-between space-x-2 rounded-lg px-2 py-1 w-full">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-6" />
              </button>

              <span className="px-4 py-2 font-medium text-gray-800">
                {formattedCurrentMonth()}
              </span>

              <button
                onClick={goToNextMonth}
                className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next month"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income Card */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow border border-green-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-200 bg-opacity-50">
                  <CircleDollarSign className="size-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-800">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {getCurrencySymbol(preferredCurrency)}
                    {income.toFixed(2)}
                  </p>
                </div>
              </div>
              {filteredTransactions.length === 0 && (
                <p className="mt-2 text-xs text-green-600 italic">
                  No income data for this period
                </p>
              )}
            </div>

            {/* Expenses Card */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg shadow border border-red-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-200 bg-opacity-50">
                  <CreditCard className="size-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-800">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {getCurrencySymbol(preferredCurrency)}
                    {expenses.toFixed(2)}
                  </p>
                </div>
              </div>

              {filteredTransactions.length === 0 && (
                <p className="mt-2 text-xs text-red-600 italic">
                  No expense data for this period
                </p>
              )}
            </div>

            {/* Balance Card */}
            <div
              className={`bg-gradient-to-r ${
                balance >= 0
                  ? "from-blue-50 to-blue-100 border-blue-200"
                  : "from-yellow-50 to-yellow-100 border-yellow-200"
              } p-6 rounded-lg shadow border`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-full ${
                    balance >= 0
                      ? "bg-blue-200 bg-opacity-50"
                      : "bg-yellow-200 bg-opacity-50"
                  }`}
                >
                  <Scale
                    className={`size-8 ${
                      balance >= 0 ? "text-blue-600" : "text-yellow-600"
                    }`}
                  />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${
                      balance >= 0 ? "text-blue-800" : "text-yellow-800"
                    }`}
                  >
                    Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      balance >= 0 ? "text-blue-700" : "text-yellow-700"
                    }`}
                  >
                    {getCurrencySymbol(preferredCurrency)}
                    {balance.toFixed(2)}
                    {balance < 0 ? " (Deficit)" : ""}
                  </p>
                </div>
              </div>
              {filteredTransactions.length === 0 && (
                <p className="mt-2 text-xs text-blue-600 italic">
                  No data for this period
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Now the real thing begins */}
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between">
            <div className="flex gap-2 bg-blue-100 rounded-full px-1 py-1">
              <button
                onClick={() => setActiveType("expense")}
                className={`px-6 py-2 rounded-full flex items-center ease-in-out duration-300 transition-all ${
                  activeType === "expense"
                    ? "bg-red-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Expense
              </button>
              <button
                onClick={() => setActiveType("income")}
                className={`px-6 py-2 rounded-full flex items-center transition-all  ${
                  activeType === "income"
                    ? "bg-green-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Income
              </button>
            </div>

            <div className="flex gap-2 bg-blue-100 rounded-full px-1 py-1">
              <button
                onClick={() => setActiveChart("pie")}
                className={`px-3 py-2 rounded-full flex items-center ease-in-out duration-300 transition-all ${
                  activeChart === "pie"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <PieChartIcon size={16} className="mr-1" /> Pie
              </button>

              <button
                onClick={() => setActiveChart("bar")}
                className={`px-3 py-2 items-center justify-center rounded-full flex ease-in-out duration-300 transition-all ${
                  activeChart === "bar"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <BarChartIcon size={16} className="mr-1" /> Bar
              </button>
              <button
                onClick={() => setActiveChart("line")}
                className={`px-3 py-2 rounded-full flex items-center ease-in-out duration-300 transition-all ${
                  activeChart === "line"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LineChartIcon size={16} className="mr-1" /> Trend
              </button>
              <button
                onClick={() => setActiveChart("area")}
                className={`px-3 py-2 rounded-full flex items-center ease-in-out duration-300 transition-all ${
                  activeChart === "area"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Activity size={16} className="mr-1" /> Area
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="w-full min-h-20 flex items-center justify-center">
              <Loader className="size-5 animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="w-full">
              <Charts
                filteredTransactions={filteredTransactions}
                activeType={activeType}
                activeChart={activeChart}
                preferredCurrency={preferredCurrency}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseIncomeVisualization;