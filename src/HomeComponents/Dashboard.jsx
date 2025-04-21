import React, { useState, useEffect, useContext } from "react";
import {
  ChevronRight,
  ChevronLeft,
  CreditCard,
  CircleDollarSign,
  Scale,
  FileCode,
  Plus,
  Carrot,
  Home as House,
  Smartphone,
  Clapperboard,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  DollarSign,
  Briefcase,
  Activity,
  Heart,
  Droplet,
  Wifi,
  LifeBuoy,
  Gift,
  TicketSlash,
  BriefcaseBusiness,
  Book,
  Loader,
} from "lucide-react";
import axios from "axios";
import endpoint from "../api";
import MyContext from "../Context";
import { getCurrencySymbol } from "../currencyUtils";
import { currencyConverter } from "../CurrencyConverter";
Book;
const Dashboard = () => {
  const {
    transactions,
    setTransactions,
    currentMonth,
    setCurrentMonth,
    setOpenDialog,
    userData,
    setOpenCardDetails,
    setSelectedItem,
  } = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);

  // Initialize current month to today's month
  useEffect(() => {
    if (!currentMonth) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      setCurrentMonth(`${year}-${month.toString().padStart(2, "0")}`);
    }
  }, []);

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

  const fetchAllTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${endpoint}/transaction/get-all-transaction/${userData?._id}`
      );

      // console.log(response);

      setTransactions(response.data.transactions);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) fetchAllTransaction();
    fetchAllTransaction();
  }, [userData]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const convertedTransactions = transactions.map((transaction) => ({
        ...transaction,
        amount: currencyConverter(
          transaction.amount,
          transaction.currency,
          userData?.preferredCurrency
        ),
      }));

      // Filter transactions by current month
      const filTransaction = convertedTransactions.filter((transaction) => {
        if (!currentMonth) return true;
        return transaction.date.startsWith(currentMonth);
      });
      setFilteredTransactions(filTransaction);

      const groupTransactions = filTransaction.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      }, {});
      setGroupedTransactions(groupTransactions);
      // console.log("The converted transaction", groupTransactions);
    }
  }, [transactions, userData, currentMonth]); // Runs when transactions change

  // Calculate totals
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  const getCategoryIcon = (category) => {
    // Map category names to Lucide icon components and colors
    const categoryMap = {
      // Income categories
      salary: { Icon: Briefcase, color: "#4CAF50" },
      investment: { Icon: DollarSign, color: "#8BC34A" },
      bonus: { Icon: CircleDollarSign, color: "#CDDC39" },
      freelance: { Icon: DollarSign, color: "#E91E63" },
      gifts: { Icon: Gift, color: "#03A9F4" },
      refunds: { Icon: TicketSlash, color: "#FFC107" },
      sidebusiness: { Icon: BriefcaseBusiness, color: "#f97316" },
      other: { Icon: DollarSign, color: "#A5D6A7" },

      // Expense categories
      groceries: { Icon: Carrot, color: "#f44336" },
      rent: { Icon: House, color: "#FFC107" },
      education: { Icon: Book, color: "#f97316" },
      entertainment: { Icon: Clapperboard, color: "#9c27b0" },
      diningout: { Icon: Utensils, color: "#FF9800" },
      shopping: { Icon: ShoppingBag, color: "#E91E63" },
      transportation: { Icon: Car, color: "#3F51B5" },
      healthcare: { Icon: Heart, color: "#F06292" },
      utilities: { Icon: Droplet, color: "#03A9F4" },
      internet: { Icon: Wifi, color: "#00BCD4" },
      // rent: {},
    };

    // If category is not found in the map, return a default icon
    return (
      categoryMap[category?.toLowerCase()] || {
        Icon: CreditCard,
        color: "#9e9e9e",
      }
    );
  };

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
                    {getCurrencySymbol(userData?.preferredCurrency)}
                    {income.toFixed(2)}

                    {/* {convertCurrency(userData.preferredCurrency, income, )} */}
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
                    {getCurrencySymbol(userData?.preferredCurrency)}
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
                    {getCurrencySymbol(userData?.preferredCurrency)}
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

          {isLoading ? (
            <div className="w-full flex gap-2 items-center justify-center min-h-40">
              <Loader className="animate-spin size-5" />
              Loading....
            </div>
          ) : (
            <>
              {filteredTransactions.length === 0 ? (
                <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <FileCode className="size-12 text-gray-400 mx-auto mb-4" />

                  <h3 className="text-lg font-medium text-gray-900">
                    No transactions for {formattedCurrentMonth()}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    There are no transactions recorded for this period. You can
                    add new transactions or navigate to a different month.
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-y-auto max-h-[65vh] mt-4 pt-6">
                  {Object.keys(groupedTransactions).map((date) => {
                    // Create a new Date object from the date string
                    const formattedDate = new Date(date);
                    // Format the date to "March 21, Saturday"
                    const options = {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    };
                    const formattedDateString = new Intl.DateTimeFormat(
                      "en-US",
                      options
                    ).format(formattedDate);

                    return (
                      <div key={date} className="mb-8">
                        {/* Date Section */}
                        <div className="font-semibold text-lg px-2">
                          {formattedDateString}
                        </div>
                        <div className="my-2 border-t-[1px] border-neutral-400" />

                        {/* Transactions for the Date */}
                        <div className="space-y-3">
                          {groupedTransactions[date].map((t) => {
                            // Get icon component and color for this category
                            const { Icon, color } = getCategoryIcon(t.category);

                            return (
                              <div
                                onClick={() => {
                                  setOpenCardDetails(true);
                                  setSelectedItem(t);
                                }}
                                key={t._id}
                                className="flex items-center py-2 px-4 border-b-[1px] hover:bg-neutral-200 cursor-pointer transition-all ease-in-out duration-300"
                              >
                                {/* Icon Section */}
                                <div
                                  className="relative inline-flex flex-shrink-0 items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4"
                                  style={{
                                    backgroundColor: color,
                                  }}
                                >
                                  {/* Render the Icon component with proper sizing */}
                                  <Icon className="size-6 text-white " />
                                </div>

                                {/* Content Section */}
                                <div className="flex-grow flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                  {/* Category and Description */}
                                  <div className="flex flex-col max-w-full">
                                    <span className="font-medium text-sm sm:text-base">
                                      {t.category.charAt(0).toUpperCase() +
                                        t.category.slice(1).toLowerCase()}
                                    </span>

                                    {t.description && (
                                      <p className="text-gray-600 text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[300px] lg:max-w-md">
                                        {t.description.length > 60
                                          ? t.description.substring(0, 60) +
                                            "..."
                                          : t.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Right Side Section */}
                                  <div className="flex items-center justify-between mt-2 sm:mt-0">
                                    {/* Type Badge (Income/Expense) */}
                                    <div className="mr-4 hidden sm:block">
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          t.type === "income"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {t.type === "income"
                                          ? "Income"
                                          : "Expense"}
                                      </span>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right">
                                      <span
                                        className={`font-medium ${
                                          t.type === "income"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {getCurrencySymbol(
                                          userData?.preferredCurrency
                                        )}
                                        {t.amount.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <button
        onClick={() => setOpenDialog(true)}
        className="absolute flex items-center cursor-pointer hover:bg-blue-800 justify-center w-[80px] h-[80px] bg-blue-700 shadow-black/40 shadow-lg rounded-full right-10 bottom-10 transition-all ease-in duration-100 z-[30] active:scale-[95%]"
      >
        <Plus className="size-10 text-white" />
      </button>
    </div>
  );
};

export default Dashboard;
