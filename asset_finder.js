// Import Alpaca SDK
const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()
const fs = require("fs")

  // Use Assets Endpoint to Create Array of All Tradable NYSE Assets
  alpaca.getAssets()
    .then((assets) => {

      // Create company arrays and counter vars
      let tradable_assets = [];
      let tradable_asset_ctr = 0;
      // Create final company arrays and counter vars
      let positive_comps = [];
      let positive_comp_ctr = 0;
      let negative_comps = [];
      let negative_comp_ctr = 0;

      // Iterate through total assets array and create tradable NYSE assets array
      for (let i=0; i<assets.length; i++) {
        if ((assets[i].exchange == 'NYSE') && (assets[i].tradable == true)) {
          tradable_assets[tradable_asset_ctr] = assets[i].symbol;
          tradable_asset_ctr++;
        }
      }

      // Print Total Number of Assets and Number of Tradable NYSE Assets
      console.log("Assets Length = " + assets.length);
      console.log("Number of Tradable NYSE Assets = " + tradable_assets.length);

  // ****** BEGIN DATA COLLECTION FROM BARS ENDPOINT******

  // Create company arrays and counter vars
  let bar_query_comps = [];
  let bar_query_comps_ctr = 0;

  // Determine number of iterations required for bar query limit of 200
  let bar_query_iterations = Math.ceil(tradable_asset_ctr / 200);

  // Iterate through NYSE Tradable Asset Array until Bar Data has been collected for All
  for (let j=0; j<bar_query_iterations; j++) {

    // Create bar limit var with default value of 200
    let bar_limit = 200;

    // Check if final loop iteration (i.e. companies left to check < 200)
    if (tradable_asset_ctr - bar_query_comps_ctr < 200) {
      bar_limit = (tradable_asset_ctr - bar_query_comps_ctr);
    }

    // Clear previous companies from bar query company array
    bar_query_comps = [];

    // Create bar query company array
    for (let i=0; i<bar_limit; i++) {
      bar_query_comps[i] = tradable_assets[bar_query_comps_ctr];
      bar_query_comps_ctr++;
    };

    // Check Price Increase over past 1000 Days of Assets in Bar Query Company Array
    let barset = alpaca.getBars(
        'day',
        bar_query_comps,
        {
            limit: 1000
        }
    ).then((barset) => {

        // Get number of companies in barset (needed for one barset != 200)
        let barset_ctr = 0;
        for (var c in barset) {
          barset_ctr++;
        }

        // Iterate through barset
        for (let i=0; i<barset_ctr; i++) {

          // *** Check bar data is valid ***

          // Get bar symbol and timestamp
          let symbol = Object.keys(barset)[i];
          let bars = barset[symbol];
          let timestamp = bars[0].t;
          var barDate = new Date(timestamp *1000);
          var barYear = barDate.getFullYear();

          // Get current year
          var d = new Date();
          var n = d.getFullYear();

          // Check if bar data is less than 5 but more than 2 years
          if ((n - barYear < 5) && (n - barYear > 1)) {
            // Determine percent change over past 1000 days
            let week_open = bars[0].o
            let week_close = bars.slice(-1)[0].c
            let percent = (week_close - week_open) / week_open * 100
            var percent_change = parseFloat(percent)

            // Check if percent change is positive or negative
            if (percent_change >= 0) {
              positive_comps[positive_comp_ctr] = {symbol: `${symbol}`, percent_change: `${percent_change}`};
              positive_comps[positive_comp_ctr].symbol = symbol;
              positive_comps[positive_comp_ctr].percent_change = percent_change;
              positive_comp_ctr++;
            }
            else {
              negative_comps[negative_comp_ctr] = {symbol: `${symbol}`, percent_change: `${percent_change}`};
              negative_comps[negative_comp_ctr].symbol = symbol;
              negative_comps[negative_comp_ctr].percent_change = percent_change;
              negative_comp_ctr++;
            }
          }
        }
    })
  }

  // Clear company json files
  clearOldResults();

  // Set delay to ensure queries are complete then sort and save results
  setTimeout(saveResults, 15000, positive_comps, negative_comps);
});


// Function to Clear Old results
function clearOldResults() {

    // ****** CLEAR positive_comps.json ******
    var jsonContent = ["empty"]
    fs.writeFile("./positive_comps.json", jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while clearing positive_comps.json");
          return console.log(err);
      }
      console.log("positive_comps.json has been cleared.");
      });
      // ****** CLEAR negative_comps.json ******
      fs.writeFile("./negative_comps.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while clearing negative_comps.json");
            return console.log(err);
        }
        console.log("negative_comps.json has been cleared.");
        });
}

function sortPercentages(a, b) {
  return a.percent_change > b.percent_change ? -1 : b.percent_change > a.percent_change ? 1 : 0;
}

// Function to Sort and Save Results
function saveResults(positive_comps, negative_comps) {

  // ****** SORT positive_comps array ******
  positive_comps.sort(sortPercentages);

  // stringify positive_comps
  let jsonContent = JSON.stringify(positive_comps);

  // ****** SAVE positive_comps.json ******
  fs.writeFile("./positive_comps.json", jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to positive_comps.json");
          return console.log(err);
      }
      console.log("positive_comps.json has been saved.");
    });

    // ****** SORT negative_comps array ******
    negative_comps.sort(sortPercentages);

    // stringify negative_comps array
    jsonContent = JSON.stringify(negative_comps);

    // ****** SAVE negative_comps.json ******
    fs.writeFile("./negative_comps.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to negative_comps.json");
            return console.log(err);
        }
        console.log("negative_comps.json has been saved.");
      });
}
