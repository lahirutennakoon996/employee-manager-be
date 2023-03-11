require('dotenv').config();
const express = require('express');
const http = require('http');

const { createDBConnection } = require("./src/services/db-connection.service");

// Connect to database
createDBConnection();

const httpPort = process.env.HTTP_PORT;

// Create express server
const server = express();

server.use("/api", require("./routes"));

const httpServer = http.createServer(server);
httpServer.listen(httpPort, () => {
  console.log(`HTTP server listening on port : ${httpPort}`);
});
