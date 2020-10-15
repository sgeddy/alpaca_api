const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()
const inputReader = require('wait-console-input') //https://www.npmjs.com/package/wait-console-input

let valid = "false"

while (valid == "false") {
  let input = inputReader.readLine("\nTo get all positions respond get. \nTo close a position respond close. \nTo close all positions respond close all. \n");
  if (input == "get" || input == "GET" || input == "Get") {
    // ***** GET ALL POSITIONS ***** //
    alpaca.getPositions().then((positions) => {
      console.log(positions)
    })
    valid = "true";
  }

  // ***** CLOSE SINGLE POSITION ***** //
  else if (input == "close" || input == "Close" || input == "CLOSE") {
    // ***** PRINT ALL ORDERS ***** //
    alpaca.getPositions().then((positions) => {
      console.log("Here are your positions: \n" + positions)
    })
    let input = inputReader.readLine("\nWhich would you like to close?\n");
    alpaca.closePosition(input).then((closedPosition) => {
      console.log(closedPosition)
    })
    valid = "true";
  }

  // ***** CLOSE ALL POSITIONS ***** //
  else if (input == "Close All" || input == "close all" || input == "CLOSED ALL") {
    alpaca.closePositions().then((closedPositions) => {
      console.log(closedPositions)
    })
    valid = "true";
  }
  
  else console.log("Invalid response.")
}
