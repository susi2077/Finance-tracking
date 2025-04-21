export function currencyConverter(amount, fromCurrency, toCurrency) {
  // console.log(fromCurrency, toCurrency, amount);
  const fromCurrencyCode = fromCurrency?.split(" - ")[0];
  const toCurrencyCode = toCurrency?.split(" - ")[0];

  const exchangeRates = {
    USD: 1, // Base currency
    EUR: 1.1, // 1 USD = 1.1 EUR
    GBP: 1.3, // 1 USD = 1.3 GBP
    JPY: 150, // 1 USD = 150 JPY
    INR: 83, // 1 USD = 83 INR
    CNY: 7.2, // 1 USD = 7.2 CNY
    AUD: 1.5, // 1 USD = 1.5 AUD
    NPR: 133, // 1 USD = 133 NPR
  };
  return (
    (amount / exchangeRates[fromCurrencyCode]) *
      exchangeRates[toCurrencyCode] || 0
  );
}
