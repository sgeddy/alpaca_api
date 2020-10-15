// Polygon Data

const WebSocket = require('ws')

const APIKEY = 'PUT YOUR API KEY'
const ws = new WebSocket('wss://alpaca.socket.polygon.io/stocks')

// Connection Opened:
ws.on('open', () => {
	console.log('Connected!')
	ws.send(`{"action":"auth","params":"${APIKEY}"}`)
	ws.send(`{"action":"subscribe","params":"Q.AAPL"}`)
})

// Per message packet:
ws.on('message', ( data ) => {
	data = JSON.parse( data )
	data.map(( msg ) => {
		if( msg.ev === 'status' ){
			return console.log('Status Update:', msg.message)
		}
		console.log('Tick:', msg)
	})
})

ws.on('error', console.log)
