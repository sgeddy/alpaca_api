const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()
const inputReader = require('wait-console-input') //https://www.npmjs.com/package/wait-console-input

let valid = "false"

while (valid == "false") {
  let input = inputReader.readLine("\nTo get all orders respond all. \nTo get open orders respond open. \nTo get closed orders respond closed. \nTo cancel all open orders respond cancel.\n");
  if (input == "all" || input == "ALL" || input == "All") {
    // ***** GET ALL ORDERS ***** //
    alpaca.getOrders({
      status: 'all',    // 'open' | 'closed' | 'all'
    }).then((order) => {
      console.log(order)
    })
    valid = "true";
  }

  // ***** GET OPEN ORDERS ***** //
  else if (input == "OPEN" || input == "open" || input == "Open") {
    alpaca.getOrders({
      status: 'open',    // 'open' | 'closed' | 'all'
    }).then((order) => {
      console.log(order)
    })
    valid = "true";
  }

  // ***** GET CLOSED ORDERS ***** //
  else if (input == "CLOSED" || input == "Closed" || input == "closed") {
    alpaca.getOrders({
      status: 'closed',    // 'open' | 'closed' | 'all'
    }).then((order) => {
      console.log(order)
    })
    valid = "true";
  }

  // ***** CANCEL OPEN ORDERS ***** //
  else if (input == "CANCEL" || input == "Cancel" || input == "cancel") {
    alpaca.getOrders({
        status: 'open',    // 'open' | 'closed' | 'all'
      }).then((order) => {
        for (let i=0; i<order.length; i++) {
          alpaca.cancelOrder(order[i].id).then((canceledOrder) => {
            console.log(canceledOrder)
          })
        }
    })
    valid = "true";
  }

  else console.log("Invalid response.")
}
