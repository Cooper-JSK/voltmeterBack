const express = require('express');
const http = require('http');
const RED = require('node-red');

const app = express();
const server = http.createServer(app);

// Node-RED settings
const settings = {
    httpAdminRoot: "/red",
    httpNodeRoot: "/api",
    userDir: "./.nodered/",
    flowFile: "flows.json",
    functionGlobalContext: {}    // enables global context
};

RED.init(server, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);

const PORT = process.env.PORT || 1880;
server.listen(PORT, () => {
    console.log(`Node-RED is running on http://localhost:${PORT}/red`);
});

RED.start();
