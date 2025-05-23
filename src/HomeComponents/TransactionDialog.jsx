import React, { useContext, useState, useRef } from "react";
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  Save,
  XCircle,
  Loader,
  FileText,
  Upload,
  Camera,
  Check,
} from "lucide-react";
import axios from "axios";
import endpoint from "../api";
import MyContext from "../Context";

const TransactionDialog = () => {
  const { setOpenDialog, selectedItem, isEditing, setIsEditing, userData } =
    useContext(MyContext);
  const [formData, setFormData] = useState({
    type: "expense",
    category: "groceries",
    description: "",
    amount: "",
    currency: userData?.preferredCurrency || "NPR",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [statementCount, setStatementCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If 'type' changes to 'income', set category to 'salary'
    if (
      name === "type" &&
      value === "income" &&
      formData.category === "groceries"
    ) {
      setFormData({
        ...formData,
        [name]: value,
        category: "salary", // Automatically change category to 'salary'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const userId = localStorage.getItem("userId");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditing) {
        const response = await axios.put(
          `${endpoint}/transaction/update-transaction/${formData._id}`,
          {
            userId: userId,
            amount: formData.amount,
            category: formData.category,
            currency: formData.currency || userData?.preferredCurrency,
            date: formData.date,
            description: formData.description,
            time: formData.time,
            type: formData.type,
          }
        );
      } else {
        const response = await axios.post(
          `${endpoint}/transaction/add-new-transaction`,
          {
            userId: userId,
            ...formData,
            currency: formData.currency || userData?.preferredCurrency,
          }
        );
        console.log(response);
      }

      setIsLoading(false);
      setOpenDialog(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleImportClick = () => {
    // Generate a random number between 1 and 15
    const randomCount = Math.floor(Math.random() * 15) + 1;
    setStatementCount(randomCount);
    setShowImportConfirm(true);
  };

  const handleScanBill = () => {
    // This would open camera in a real implementation
    alert("This feature would open your camera to scan a bill");
  };
  
  const handleFileSelected = (e) => {
    // This would parse the bank statement in a real implementation
    if (e.target.files && e.target.files.length > 0) {
      alert(`File "${e.target.files[0].name}" would be processed to extract transaction details`);
    }
  };

  const handleConfirmImport = () => {
    alert(`Syncing ${statementCount} statements from your bank. This might take a moment.`);
    setShowImportConfirm(false);
  };

  useState(() => {
    if (selectedItem) {
      setFormData(selectedItem);
    }
  }, [selectedItem]);

  const categories = {
    expense: [
      "Groceries",
      "Rent",
      "Utilities",
      "Transportation",
      "Entertainment",
      "Healthcare",
      "Dining Out",
      "Shopping",
      "Education",
      "Other",
    ],
    income: [
      "Salary",
      "Freelance",
      "Investments",
      "Gifts",
      "Refunds",
      "Side Business",
      "Other",
    ],
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
    >
      {showImportConfirm ? (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Import Bank Statements</h3>
          <p className="text-gray-600 mb-6">
            You have {statementCount} {statementCount === 1 ? 'statement' : 'statements'} available to sync from your bank. 
            Would you like to import all of them?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowImportConfirm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Check className="size-5 mr-2" />
              Import All
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {isEditing ? "Edit Transaction" : "Add New Transaction"}
            </h2>
            <button
              onClick={() => setOpenDialog(false)}
              className="text-white hover:bg-blue-600 rounded-full p-1"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Import Methods */}
          {!isEditing && (
            <div className="p-4 bg-gray-50 border-b flex justify-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                accept=".csv,.xlsx,.xls"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleImportClick}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                <FileText className="size-4 mr-2 text-blue-600" />
                Import Bank Statement
              </button>
              <button
                type="button"
                onClick={handleScanBill}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                <Camera className="size-4 mr-2 text-green-600" />
                Scan Bill
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto max-h-[85vh]"
          >
            {/* Transaction Type */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === "income"}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-green-600 font-medium">Income</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === "expense"}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-red-600 font-medium">Expense</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  {categories[formData.type].map((category) => (
                    <option
                      key={category.toLowerCase()}
                      value={category.toLowerCase()}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="size-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="block w-full rounded-md border border-gray-300 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="What's this transaction for?"
              ></textarea>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="size-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Clock className="size-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <XCircle className="size-5 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <>
                    <Loader className="size-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-5 mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default TransactionDialog;