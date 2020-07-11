const config = require('./config.json')
const ws = require('ws')

const fs = require('fs')
const http = require('http')
const WebSocket = require('ws')

const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    for (const client of wss.clients) {
      if (client !== ws) {
        console.log('send -> ' + message)
        client.send(message)
      }
    }
  })
  console.log('a client connected')
})

server.listen(config.wsPort)
