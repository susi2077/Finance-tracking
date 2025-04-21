import { useState, useEffect, useContext } from "react";
import endpoint from "../api";
import axios from "axios";
import MyContext from "../Context";

export default function Settings() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const { userData, setIsCurrencyChanged } = useContext(MyContext);

  // Form state
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: 0,
    preferredCurrency: "NPR - Nepali Rupee (रू)",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

    setIsLoading(true);

    try {
      // Make API request
      const response = await axios.put(
        `${endpoint}/user/update-user/${userData._id}`,
        dataToSubmit
      );
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
      showToastNotification(
        error.message || "Failed to update settings",
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
                value={formData.preferredCurrency}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
              >
                <option>NPR - Nepali Rupee (रू)</option>
                <option>USD - US Dollar ($)</option>
                <option>EUR - Euro (€)</option>
                <option>GBP - British Pound (£)</option>
                <option>JPY - Japanese Yen (¥)</option>
                <option>INR - Indian Rupee (₹)</option>
                <option>CNY - Chinese Yuan (¥)</option>
                <option>AUD - Australian Dollar (A$)</option>
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
      </div>
    </div>
  );
}
