export default {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  localeDate: (str) => new Date(str).toLocaleString(),
  currencyUSD: (str) => '$' + Number(str).toFixed(2)
}