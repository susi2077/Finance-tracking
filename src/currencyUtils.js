export function getCurrencySymbol(preferredCurrency) {
  const currencyCode = preferredCurrency?.split(" - ")[0]; // Extract currency code

  switch (currencyCode) {
    case "NPR":
      return "रू";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "INR":
      return "₹";
    case "CNY":
      return "¥";
    case "AUD":
      return "A$";
    default:
      return "";
  }
}
