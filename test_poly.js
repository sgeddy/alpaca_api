const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()
const fetch = require("node-fetch");

//  https://api.polygon.io/v2/reference/financials/AAPL?apiKey=YOUR API KEY

let theUrl = "https://api.polygon.io/v2/reference/financials/AAPL?apiKey=PUT YOUR API KEY HERE"

fetch(theUrl).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Sumfin brokedid");
});
