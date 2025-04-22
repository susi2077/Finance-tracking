export const currencyConverter = (amount, fromCurrency, toCurrency) => {
  // Ensure amount is treated as a number
  const numericAmount = parseFloat(amount);
  
  // Safety check for invalid values
  if (isNaN(numericAmount)) {
    console.error("Currency conversion error: amount is not a valid number", amount);
    return 0;
  }
  
  if (!fromCurrency || !toCurrency) {
    console.error(`Currency conversion error: invalid currencies - from: ${fromCurrency}, to: ${toCurrency}`);
    return numericAmount; // Return original amount if currencies are invalid
  }
  
  // If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) {
    return numericAmount;
  }
  
  // These are example exchange rates - replace with your actual rates
  const exchangeRates = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.81,
    JPY: 151.18,
    CAD: 1.37,
    AUD: 1.53,
    CNY: 7.25,
    INR: 83.49,
    NPR: 133.27,
    // Add other currencies as needed
  };
  
  // Check if we have rates for both currencies
  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    console.error(`Currency conversion error: missing rate for ${fromCurrency} or ${toCurrency}`);
    return numericAmount; // Return original amount if rate is missing
  }
  
  // Convert to USD first (as base currency), then to target currency
  const inUSD = numericAmount / exchangeRates[fromCurrency];
  const converted = inUSD * exchangeRates[toCurrency];
  
  // Return with 2 decimal places
  return Math.round(converted * 100) / 100;
};