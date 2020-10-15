const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()
const fetch = require("node-fetch");

//  https://api.polygon.io/v2/reference/financials/AAPL?apiKey=AKX5PHEQDKKD1QQMEFWP

let theUrl = "https://api.polygon.io/v2/reference/financials/AAPL?apiKey=AKX5PHEQDKKD1QQMEFWP"

fetch(theUrl).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Sumfin brokedid");
});
