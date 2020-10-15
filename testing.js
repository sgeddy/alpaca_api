
// Define tax year and month
let year = '2019';

for (let j=1; j<13; j++) {

  let month = j;

  // Set month based on j
  if (j<10) {
    month = '0'+j;
  }

  // Set start and end dates for month
  var startDate = year + "-" + month + "-" + "01"
  var lastDayOfMonth = new Date(year, month, 0);
  var endDate = year + "-" + month + "-" + lastDayOfMonth.getDate()

}
