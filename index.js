const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');
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

// Mongoose configuration
const mongoUri = "mongodb+srv://janithakarunarathna12:E3OUigKBJAVPHgAi@voltmeterv1.vxefnw8.mongodb.net/VoltmeterV1?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const ReadingSchema = new mongoose.Schema({
    timestamp: Date,
    adc0: Number,
    volts0: Number,
    adc1: Number,
    volts1: Number,
    adc2: Number,
    volts2: Number,
    adc3: Number,
    volts3: Number
});

const Reading = mongoose.model('Reading', ReadingSchema);

// WebSocket server setup
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    const sendReadings = async () => {
        try {
            const readings = await Reading.find({}).exec();
            ws.send(JSON.stringify(readings));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Send data every 30 seconds
    const interval = setInterval(sendReadings, 15000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 1880;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/red`);
});

RED.start();
