import React, { useState, useEffect, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  ChevronRight,
  ChevronLeft,
  CreditCard,
  TrendingUp,
  DollarSign,
  LightbulbIcon,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Info,
  ArrowRight,
  Zap,
  PieChart,
  BarChart3,
  Star,
  Clock,
  TrendingDown,
} from "lucide-react";
import MyContext from "./Context";
import { getCurrencySymbol, getCurrencyCode } from "./CurrencyUtils";
import axios from "axios";
import endpoint from "./api";

// Static trading data for top companies
const stockPriceData = [
  { date: "Apr 15", AAPL: 169.75, MSFT: 399.80, AMZN: 182.45, NVDA: 870.39, GOOGL: 155.72 },
  { date: "Apr 16", AAPL: 172.48, MSFT: 403.78, AMZN: 185.18, NVDA: 881.86, GOOGL: 157.80 },
  { date: "Apr 17", AAPL: 171.96, MSFT: 402.25, AMZN: 183.50, NVDA: 877.63, GOOGL: 156.94 },
  { date: "Apr 18", AAPL: 173.88, MSFT: 409.07, AMZN: 187.05, NVDA: 893.27, GOOGL: 159.42 },
  { date: "Apr 19", AAPL: 175.04, MSFT: 412.41, AMZN: 189.35, NVDA: 901.68, GOOGL: 162.10 },
  { date: "Apr 20", AAPL: 174.58, MSFT: 410.62, AMZN: 188.47, NVDA: 896.71, GOOGL: 161.33 },
  { date: "Apr 21", AAPL: 176.55, MSFT: 415.87, AMZN: 191.25, NVDA: 912.45, GOOGL: 163.47 },
  { date: "Apr 22", AAPL: 178.72, MSFT: 420.45, AMZN: 193.80, NVDA: 925.62, GOOGL: 165.23 },
];

// Current stock info
const stocks = [
  { 
    symbol: "AAPL", 
    name: "Apple Inc.",
    price: 178.72, 
    change: 2.17, 
    changePercent: 1.23,
    marketCap: "2.8T",
    color: "#4CAF50"
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft Corp.",
    price: 420.45, 
    change: 4.58, 
    changePercent: 1.10,
    marketCap: "3.1T",
    color: "#2196F3"
  },
  { 
    symbol: "AMZN", 
    name: "Amazon.com Inc.",
    price: 193.80, 
    change: 2.55, 
    changePercent: 1.33,
    marketCap: "2.0T",
    color: "#FF9800"
  },
  { 
    symbol: "NVDA", 
    name: "NVIDIA Corp.",
    price: 925.62, 
    change: 13.17, 
    changePercent: 1.44,
    marketCap: "2.3T",
    color: "#8bc34a"
  },
  { 
    symbol: "GOOGL", 
    name: "Alphabet Inc.",
    price: 165.23, 
    change: 1.76, 
    changePercent: 1.08,
    marketCap: "2.1T",
    color: "#9C27B0"
  }
];

// Gold price data in USD
const goldPriceData = [
  { date: "Apr 15", price: 2383.45, change: 0.8 },
  { date: "Apr 16", price: 2378.20, change: -0.2 },
  { date: "Apr 17", price: 2390.75, change: 0.5 },
  { date: "Apr 18", price: 2402.30, change: 0.5 },
  { date: "Apr 19", price: 2415.65, change: 0.6 },
  { date: "Apr 20", price: 2420.10, change: 0.2 },
  { date: "Apr 21", price: 2425.50, change: 0.2 },
  { date: "Apr 22", price: 2432.80, change: 0.3 },
];

// Enhanced motivational finance quotes
const financialQuotes = [
  "The stock market is a device for transferring money from the impatient to the patient. — Warren Buffett",
  "In investing, what is comfortable is rarely profitable. — Robert Arnott",
  "The four most dangerous words in investing are: 'this time it's different.' — Sir John Templeton",
  "The individual investor should act consistently as an investor and not as a speculator. — Ben Graham",
  "Risk comes from not knowing what you're doing. — Warren Buffett",
  "The stock market is filled with individuals who know the price of everything, but the value of nothing. — Philip Fisher",
  "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for. — Robert Kiyosaki",
  "The only value of stock forecasters is to make fortune-tellers look good. — Warren Buffett",
  "The stock market is designed to transfer money from the active to the patient. — Warren Buffett",
  "Wide diversification is only required when investors do not understand what they are doing. — Warren Buffett",
  "Never test the depth of a river with both feet. — Warren Buffett",
  "The market is a pendulum that forever swings between unsustainable optimism and unjustified pessimism. — Benjamin Graham",
  "The best time to plant a tree was 20 years ago. The second best time is now. — Chinese Proverb",
  "The most important investment you can make is in yourself. — Warren Buffett",
  "Bottoms in the investment world don't end with four-year lows; they end with 10- or 15-year lows. — Jim Rogers",
  "Money is a terrible master but an excellent servant. — P.T. Barnum",
  "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make. — Dave Ramsey",
  "An investment in knowledge pays the best interest. — Benjamin Franklin",
  "The only investors who shouldn't diversify are those who are right 100% of the time. — John Templeton",
  "In the short run, the market is a voting machine. In the long run, it's a weighing machine. — Benjamin Graham"
];

// Enhanced investment recommendations
const companyRecommendations = [
  {
    company: "NVIDIA Corporation (NVDA)",
    industry: "Semiconductors",
    description: "Leading in AI and GPU technology with strong growth potential in data centers, gaming, and autonomous vehicles.",
    analyst: "Strong Buy",
    target: "$1,100.00",
    upside: "18.8%",
    pe: "73.2",
    icon: "🔥"
  },
  {
    company: "Microsoft Corporation (MSFT)",
    industry: "Software",
    description: "Cloud dominance with Azure, strong AI integration, and recurring revenue from Microsoft 365 subscriptions.",
    analyst: "Buy",
    target: "$450.00",
    upside: "7.0%",
    pe: "35.6",
    icon: "🚀"
  },
  {
    company: "Amazon.com, Inc. (AMZN)",
    industry: "E-Commerce & Cloud",
    description: "E-commerce giant with AWS cloud leadership and expanding advertising business showing margin improvement.",
    analyst: "Buy",
    target: "$220.00",
    upside: "13.5%",
    pe: "48.7",
    icon: "📦"
  },
  {
    company: "Apple Inc. (AAPL)",
    industry: "Consumer Electronics",
    description: "Strong ecosystem, loyal customer base, services growth, and potential in AR/VR with Vision Pro.",
    analyst: "Hold",
    target: "$190.00",
    upside: "6.3%",
    pe: "29.4",
    icon: "🍎"
  }
];

const Transactions = () => {
  const {
    transactions,
    setTransactions,
    currentMonth,
    setCurrentMonth,
    userData,
  } = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeTimeframe, setActiveTimeframe] = useState("1W");
  const [activeStock, setActiveStock] = useState("AAPL");
  const [showInvestmentTips, setShowInvestmentTips] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [categoryTotals, setCategoryTotals] = useState({});
  const [topCategories, setTopCategories] = useState([]);

  const userId = localStorage.getItem("userId");
  
  // Initialize quote rotation - now with 30 second intervals
  useEffect(() => {
    // Set initial quote
    const randomIndex = Math.floor(Math.random() * financialQuotes.length);
    setCurrentQuote(financialQuotes[randomIndex]);
    
    // Rotate quotes every 30 seconds
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * financialQuotes.length);
      setCurrentQuote(financialQuotes[newIndex]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch all transactions
  const fetchAllTransactions = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        console.error("No user ID available, cannot fetch transactions");
        setIsLoading(false);
        return;
      }
      
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
      } else {
        setTransactions([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllTransactions();
  }, [userId]);

  // Process transactions when they change
  useEffect(() => {
    if (transactions && transactions.length > 0 && userData?.preferredCurrency) {
      // Convert all transactions to user's preferred currency
      const convertedTransactions = transactions.map(transaction => {
        const fromCurrency = getCurrencyCode(transaction.currency) || 'NPR';
        const toCurrency = getCurrencyCode(userData?.preferredCurrency) || 'NPR';
        
        return {
          ...transaction,
          amount: parseFloat(transaction.amount),
          formattedDate: new Date(transaction.date).toLocaleDateString()
        };
      });
      
      setFilteredTransactions(convertedTransactions);
      
      // Calculate category totals for expense analysis
      const expensesByCategory = {};
      convertedTransactions
        .filter(t => t.type === "expense")
        .forEach(t => {
          const category = t.category.charAt(0).toUpperCase() + t.category.slice(1);
          expensesByCategory[category] = (expensesByCategory[category] || 0) + t.amount;
        });
      
      setCategoryTotals(expensesByCategory);
      
      // Get top spending categories
      const sortedCategories = Object.entries(expensesByCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: Math.round((amount / convertedTransactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0)) * 100)
        }));
      
      setTopCategories(sortedCategories);
    }
  }, [transactions, userData]);

  // Generate chart data based on active timeframe and stock
  const getStockChartData = () => {
    return stockPriceData.map(day => ({
      date: day.date,
      price: day[activeStock]
    }));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment & Market Insights</h1>
        
        {/* Financial Quote Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-5 mb-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-2 right-3 flex items-center text-xs text-indigo-200">
            <Clock className="size-3 mr-1" />
            <span>Quote refreshes every 30s</span>
          </div>
          <div className="flex items-center">
            <LightbulbIcon className="size-9 mr-4 text-yellow-300 flex-shrink-0" />
            <div>
              <p className="text-lg font-medium italic">{currentQuote.split('—')[0]}</p>
              {currentQuote.includes('—') && (
                <p className="text-sm text-indigo-200 mt-1">— {currentQuote.split('—')[1]}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Market Leaders Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <TrendingUp className="size-5 mr-2 text-green-500" />
            Market Leaders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stocks.map((stock) => (
              <div 
                key={stock.symbol}
                onClick={() => setActiveStock(stock.symbol)}
                className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                  activeStock === stock.symbol ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-lg">{stock.symbol}</div>
                  <div 
                    className={`text-xs px-2 py-1 rounded-full ${
                      stock.changePercent > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{stock.name}</div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">${stock.price.toFixed(2)}</div>
                  <div className={stock.changePercent > 0 ? 'text-green-600' : 'text-red-600'}>
                    {stock.changePercent > 0 ? (
                      <ArrowUpRight className="size-4" />
                    ) : (
                      <ArrowDownRight className="size-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stock Price Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <DollarSign className="size-5 mr-1" style={{ color: stocks.find(s => s.symbol === activeStock)?.color }} />
                {activeStock} Price Chart (USD)
              </h2>
              <div className="flex bg-gray-100 rounded-lg">
                {["1D", "1W", "1M", "3M", "1Y"].map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setActiveTimeframe(timeframe)}
                    className={`py-1 px-3 text-sm rounded-lg ${
                      activeTimeframe === timeframe
                        ? "bg-blue-500 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getStockChartData()} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={stocks.find(s => s.symbol === activeStock)?.color || "#8884d8"} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={stocks.find(s => s.symbol === activeStock)?.color || "#8884d8"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip formatter={(value) => [`$${value}`, "Price"]} />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={stocks.find(s => s.symbol === activeStock)?.color || "#8884d8"} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Current Price:</span>
                <span className="font-bold text-xl">${stocks.find(s => s.symbol === activeStock)?.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">24h Change:</span>
                <span className={`font-medium flex items-center ${
                  stocks.find(s => s.symbol === activeStock)?.changePercent > 0 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {stocks.find(s => s.symbol === activeStock)?.changePercent > 0 ? (
                    <ArrowUpRight className="size-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="size-4 mr-1" />
                  )}
                  {stocks.find(s => s.symbol === activeStock)?.changePercent}%
                </span>
              </div>
              <button className="text-blue-500 flex items-center text-sm">
                <RefreshCw className="size-4 mr-1" />
                Refresh Data
              </button>
            </div>
          </div>
          
          {/* Spending by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="size-5 mr-1 text-purple-500" />
              Top Spending Categories
            </h2>
            
            {topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-gray-600">
                        {getCurrencySymbol(userData?.preferredCurrency)}
                        {category.amount.toFixed(2)} ({category.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          index === 0 ? "bg-purple-600" :
                          index === 1 ? "bg-blue-500" :
                          index === 2 ? "bg-green-500" :
                          "bg-yellow-500"
                        }`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <button className="text-blue-500 flex items-center text-sm mt-4">
                  <BarChart3 className="size-4 mr-1" />
                  View Full Spending Report
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No spending data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Gold Price Tracking */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <DollarSign className="size-5 mr-1 text-yellow-500" />
              Gold Price Tracking (USD/oz)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goldPriceData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip formatter={(value) => [`$${value}`, "Price"]} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#FFD700" 
                    strokeWidth={2}
                    dot={{ stroke: '#FFD700', strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: '#FFD700', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-center mb-3">
                  <div className="text-xl font-bold text-yellow-700">Current Gold Price</div>
                  <div className="text-3xl font-bold text-yellow-800">${goldPriceData[goldPriceData.length - 1].price}</div>
                  <div className={`text-sm flex items-center justify-center mt-1 ${
                    goldPriceData[goldPriceData.length - 1].change >= 0 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {goldPriceData[goldPriceData.length - 1].change >= 0 ? (
                      <ArrowUpRight className="size-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="size-4 mr-1" />
                    )}
                    {goldPriceData[goldPriceData.length - 1].change}% today
                  </div>
                </div>
                
                <div className="text-sm text-yellow-700 text-center mt-3">
                  <div className="font-medium">7-Day Trend:</div>
                  <div className="flex justify-center space-x-1 mt-1">
                    {goldPriceData.map((day, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-3 rounded-sm ${day.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        title={`${day.date}: ${day.change >= 0 ? '+' : ''}${day.change}%`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Investment Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <Star className="size-5 mr-1 text-amber-500" />
              Top Investment Recommendations
            </h2>
            <button
              onClick={() => setShowInvestmentTips(!showInvestmentTips)}
              className="text-blue-500 flex items-center text-sm"
            >
              <Info className="size-4 mr-1" />
              Investment Tips
            </button>
          </div>
          
          {showInvestmentTips && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800">
              <h3 className="font-medium mb-2">Smart Investing Guidelines:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Diversify across industries to reduce sector-specific risks</li>
                <li>Consider your time horizon—longer periods allow for higher risk tolerance</li>
                <li>Evaluate your risk tolerance honestly before investing</li>
                <li>Research companies thoroughly, focusing on fundamentals not just trends</li>
                <li>Remember that past performance doesn't guarantee future results</li>
              </ul>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analyst Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Target</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Upside</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companyRecommendations.map((rec, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{rec.icon}</span>
                        <div>
                          <div className="font-medium">{rec.company}</div>
                          <div className="text-xs text-gray-500 mt-1">P/E: {rec.pe}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{rec.industry}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rec.analyst === "Strong Buy" ? "bg-green-100 text-green-800" :
                        rec.analyst === "Buy" ? "bg-blue-100 text-blue-800" :
                        rec.analyst === "Hold" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {rec.analyst}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">{rec.target}</td>
                    <td className="px-4 py-4 text-sm text-green-600 font-medium">+{rec.upside}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
              <Info className="size-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Investment Disclaimer</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    All investment recommendations are provided for informational purposes only. 
                    Please consult with a certified financial advisor before making investment decisions. 
                    Market conditions change rapidly, and past performance is not indicative of future results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <CreditCard className="size-5 mr-1 text-gray-700" />
              Recent Transactions
            </h2>
            <button className="bg-gray-100 p-2 rounded-lg">
              <Filter className="size-4 text-gray-600" />
            </button>
          </div>
          
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === "income" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description || "-"}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        {getCurrencySymbol(userData?.preferredCurrency)}
                        {transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Transactions
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;