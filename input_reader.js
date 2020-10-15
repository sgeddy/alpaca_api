//https://www.npmjs.com/package/wait-console-input
const inputReader = require('wait-console-input')

let valid = "false";

while (valid == "false") {
  let input = inputReader.readLine( "Confirm order? Yes or No\n");
  if (input == "Yes" || input == "YES" || input == "Y" || input == "yes" || input == "y") {
    // place order
    console.log("order placed");
    valid = "true";
  }

  else if (input == "No" || input == "NO" || input == "N" || input == "no" || input == "n") {
    // skip order
    console.log("order cancled");
    valid = "true";
  }

  else console.log("Invalid response. Please enter Yes or No.")
}

console.log("complete");
