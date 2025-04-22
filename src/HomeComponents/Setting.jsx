import { useState, useEffect, useContext } from "react";
import endpoint from "../api";
import axios from "axios";
import MyContext from "../Context";

// Map of currency codes to their display names
const currencyOptions = {
  NPR: "NPR - Nepali Rupee (रू)",
  USD: "USD - US Dollar ($)",
  EUR: "EUR - Euro (€)",
  GBP: "GBP - British Pound (£)",
  JPY: "JPY - Japanese Yen (¥)",
  INR: "INR - Indian Rupee (₹)",
  CNY: "CNY - Chinese Yuan (¥)",
  AUD: "AUD - Australian Dollar (A$)"
};

// Get currency code from the display name
const getCurrencyCode = (displayName) => {
  if (!displayName) return "NPR";
  return displayName.split(" - ")[0];
};

// Get display name from currency code
const getCurrencyDisplayName = (code) => {
  return currencyOptions[code] || currencyOptions.NPR;
};

export default function Settings() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const { userData, setIsCurrencyChanged } = useContext(MyContext);

  const userId = localStorage.getItem("userId");

  // Form state
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
    preferredCurrency: "NPR",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data directly if userData from context isn't available
  const fetchUserData = async () => {
    if (!userId) return;
    
    setIsFetchingUser(true);
    try {
      const response = await axios.get(
        `${endpoint}/user/get-user/${userId}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (response.data && response.data.user) {
        const user = response.data.user;
        setFormData({
          ...user,
          preferredCurrency: user.preferredCurrency || "NPR",
          phone: user.phone || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showToastNotification("Failed to load user data. Please refresh the page.", "error");
    } finally {
      setIsFetchingUser(false);
    }
  };

  // Try to use userData from context, or fetch directly if not available
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      // Use data from context if available
      setFormData({
        ...userData,
        preferredCurrency: userData.preferredCurrency || "NPR",
        phone: userData.phone || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } else if (userId) {
      // Fetch directly if userId is available but userData isn't
      fetchUserData();
    }
  }, [userData, userId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For currency, we need to extract just the currency code
    if (name === "preferredCurrency") {
      setFormData({
        ...formData,
        [name]: getCurrencyCode(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Show toast notification
  const showToastNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match if changing password
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      showToastNotification("New passwords don't match", "error");
      return;
    }

    // Only include password fields if current password is provided
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.oldPassword) {
      delete dataToSubmit.oldPassword;
      delete dataToSubmit.newPassword;
      delete dataToSubmit.confirmPassword;
    }

    // Make sure we're only sending the currency code, not the full display name
    dataToSubmit.preferredCurrency = getCurrencyCode(dataToSubmit.preferredCurrency);

    setIsLoading(true);

    try {
      // Make API request
      const response = await axios.put(
        `${endpoint}/user/update-user/${userId}`,
        dataToSubmit,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      
      // Notify the app that currency has changed
      setIsCurrencyChanged(true);

      // Clear password fields
      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showToastNotification("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      showToastNotification(
        error.response?.data?.message || error.message || "Failed to update settings",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-6xl px-10 py-8">
        <h2 className="text-2xl font-medium mb-8 text-gray-800">
          Account Settings
        </h2>

        {showToast && (
          <div
            className={`fixed top-4 right-4 ${
              toastType === "error" ? "bg-red-600" : "bg-gray-800"
            } text-white px-4 py-3 rounded shadow-lg z-50 flex items-center`}
          >
            {toastType === "error" ? (
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <p>{toastMessage}</p>
          </div>
        )}

        {isFetchingUser ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            <section>
              <h3 className="text-lg font-medium mb-4 pb-2 border-b">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="fName"
                    value={formData.fName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lName"
                    value={formData.lName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-4 pb-2 border-b">
                Currency Settings
              </h3>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Currency
                </label>
                <select
                  name="preferredCurrency"
                  value={getCurrencyDisplayName(formData.preferredCurrency)}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                >
                  {Object.values(currencyOptions).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-4 pb-2 border-b">
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="h-2"></div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}