const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()
const fs = require("fs")
const inputReader = require('wait-console-input') //https://www.npmjs.com/package/wait-console-input


// ***** COLLECT ALL INPUTS PRIOR TO REQUEST ***** //

// Collect watchlist
let watchlists = []
fs.readFile('./watchlists.json', 'utf8', (err, data) => {
  if (err) throw err;
  else {
    watchlists = JSON.parse(data);
  }
})

// Check if testing mode
let test_mode = false
let testing = inputReader.readLine("\nAre you testing? Yes or No\n");
if (testing == "Yes" || testing == "YES" || testing == "Y" || testing == "yes" || testing == "y") {
  test_mode = true
}

// ***** END --> COLLECT ALL INPUTS PRIOR TO REQUEST ***** //


// ***** CHECK IF MARKET IS OPEN ***** //
alpaca.getClock(watchlists, test_mode).then((market_status) => {

  // Check if closed
  if (market_status.is_open == false && test_mode == false) console.log("\nMarket is closed. Please try again after: " + market_status.next_open + "\n")

  // Check if open
  else if (market_status.is_open == true || test_mode == true) {
    console.log("\nMarket is open. Let's do it.")

// ***** END --> CHECK IF MARKET IS OPEN ***** //


// ***** DETERMINE TICKERS BEING PURCHASED ***** //

    // Define var for symbols to purcahse
    let symbols = [];

    // Check for watchlist purchase
    let valid = "false"
    while (valid == "false") {
      let input = inputReader.readLine("\nWould you like to purchase a watchlist? Yes or No\n");

      // Print watchlists
      if (input == "Yes" || input == "YES" || input == "Y" || input == "yes" || input == "y") {
        console.log("\nOk. Here are your watchlists.\n")
        console.log(watchlists)
        /*
        // Collect watchlist names
        let watchlist_names = []
        for (let i=0; i<watchlists.length; i++) {
          watchlist_names[i] = watchlists[i].name;
        }
        console.log(watchlist_names);
        */


        // Select watchlist from user input
        let watchlist = inputReader.readLine("\nWhich would you like to purchase?\n");

        for (let j=0; j<watchlists.length; j++) {
          if (watchlists[j].name == watchlist) {
            console.log("\nOk great, you've selected the " + watchlists[j].name + " watchlist.")

            // Save watchlist symbols to symbols var for purchase
            for (let i=0; i<watchlists[j].symbols.length; i++) {
              symbols[i] = watchlists[j].symbols[i]
            }
            console.log("\nWe will proceed to purchase the following stocks: " + symbols + "\n")
          }
        }

        // Exit while loop
        valid = "true";
      }

      // Manually enter tickers
      else if (input == "No" || input == "NO" || input == "N" || input == "no" || input == "n") {
        let tickers = inputReader.readLine("\nOk. Please enter the stock tickers you would like to purchase seperated by commas.\n");

        // Parse tickers from user input
        console.log("This function hasn't been built yet!")
        // Confirm tickers with user and continue
        valid = "true";
      }

      //else console.log("\nInvalid response. Please enter Yes or No.\n")
    } // close --> while (valid == "false")

// ***** END --> DETERMINE TICKERS BEING PURCHASED ***** //


// ***** CALCULATE NUMBER OF SHARES PER SYMBOL TO PURCHASE ***** //

    alpaca.getAccount(symbols)
      .then((account) => {
          // Check if our account is restricted from trading.
          if (account.trading_blocked) {
              console.log('Account is currently restricted from trading.')
          }

          else {
            let cash = account.cash
            // Check how much cash we can use to open new positions.
            console.log('\nYou have $' + cash + " cash in your account.");

            // Divide by number of symbols
            let cashpersym = cash / symbols.length;
            console.log('\nCash per Symbol: $' + cashpersym.toFixed(2));

            // Create var for orders
            let orders = [];

            // Iterate through symbols list and determine number of shares per symbol
            for (let i=0; i<symbols.length; i++) {
              let ticker = symbols[i];

              // get last price from bars endpoint
              const barset = alpaca.getBars(
                  'minute',
                  ticker,
                  {
                      limit: 1
                  }
              ).then((barset) => {
                  let bar = barset[ticker]
                  let currentPrice = bar[0].c

                  // Determine number of shares
                  var shares = Math.floor(cashpersym/currentPrice);
                  var remainder = cashpersym % currentPrice;
                  let percent = (shares * currentPrice)/cash*100;
                  orders[i] = {ticker: `${ticker}`, lastPrice: `${currentPrice}`, shares: `${shares}`, percent: `${percent}`+"%", remainder: `${remainder}`};
                  console.log(orders[i]);

// ***** END --> CALCULATE NUMBER OF SHARES PER SYMBOL TO PURCHASE ***** //


// ***** CONFIRM & PLACE / CANCEL ORDER ***** //

                  let valid = "false";

                  while (valid == "false") {
                    let input = inputReader.readLine( "Confirm order? Yes or No\n");
                    if (input == "Yes" || input == "YES" || input == "Y" || input == "yes" || input == "y") {
                      // ***** PLACE ORDER ***** //
                      alpaca.createOrder({
                          symbol: ticker,
                          qty: shares,
                          side: 'buy',
                          type: 'market',
                          time_in_force: 'day'
                      })
                      console.log("\nOrder placed.\n");
                      valid = "true";
                    }

                    else if (input == "No" || input == "NO" || input == "N" || input == "no" || input == "n") {
                      // skip order
                      console.log("\nOrder canceled.\n");
                      valid = "true";
                    }

                    else console.log("Invalid response. Please enter Yes or No.")
                  }

                }) // close --> then((barset) =>

            } // close --> for (let i=0; i<symbols.length; i++)

// ***** END --> CONFIRM & PLACE / CANCEL ORDER ***** //

          } // close --> else

        }) // close --> alpaca.getAccount().then((account)

  } // close --> else if (market_status.is_open == true)

}) // close initial alpaca request --> alpaca.getClock().then((market_status)
