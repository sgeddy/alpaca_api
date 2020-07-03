const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()
const inputReader = require('wait-console-input') //https://www.npmjs.com/package/wait-console-input

let valid = "false"

while (valid == "false") {
  let input = inputReader.readLine("\nTo get all account data respond all. \nTo get a summary respond summary.\n");
  if (input == "all" || input == "ALL" || input == "All") {
    // ***** GET ALL ACCOUNT INFO ***** //
    alpaca.getAccount()
        .then((account) => {
            // Check if our account is restricted from trading.
            if (account.trading_blocked) {
                console.log('\nAccount is currently restricted from trading.')
            }
            // Check how much money we can use to open new positions.
            console.log('\nFull account info:\n', account)
        })
    valid = "true";
  }

  // ***** GET ACCOUNT SUMMARY ***** //
  else if (input == "SUMMARY" || input == "summary" || input == "Summary") {
    alpaca.getAccount()
        .then((account) => {
            // Check if our account is restricted from trading.
            if (account.trading_blocked) {
                console.log('\nAccount is currently restricted from trading.')
            }
            // Check how much money we can use to open new positions.
            console.log('\nAccount Summary:\n', '\nCash: $' + account.cash,
            '\nPortfolio Value: $' + account.portfolio_value, '\nPrevious Portfolio Value: $' + account.last_equity)
        })
    valid = "true";
  }

  else console.log("Invalid response.")
}
