const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca()


// Stock to lookup
let ticker = "AAPL";

// Get daily price data for AAPL over the last 5 trading days.
const barset = alpaca.getBars(
    'minute',
    ticker,
    {
        limit: 1
    }
).then((barset) => {
    const aapl_bars = barset[ticker]

    // See how much AAPL moved in that timeframe.
    const week_open = aapl_bars[0].o
    console.log(aapl_bars[0]);
    const week_close = aapl_bars.slice(-1)[0].c
    console.log(aapl_bars.slice(-1)[0]);
    const percent_change = (week_close - week_open) / week_open * 100
    console.log(`${ticker} moved ${percent_change}% over the last 1000 days`)

})
