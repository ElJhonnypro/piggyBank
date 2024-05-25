"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const databasemanage_1 = require("./databasemanage");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = 2345;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(body_parser_1.default.json()); // Add body-parser middleware to parse JSON bodies
// Middleware para verificar la contraseña de la API
app.use((req, res, next) => {
    console.log(req.body);
    const { passwordapi } = req.body;
    if (passwordapi === 'myapipassword') {
        next();
    }
    else {
        res.status(401).send({
            message: 'Your API password is incorrect',
        });
    }
});
app.get('/info', (req, res) => {
    res.send({
        message: "Welcome to Jhon's Piggy Bank, you need authentication in /info",
        send_data: null
    });
});
app.post('/', (req, res) => {
    res.send({
        message: "Welcome to Jhon's Piggy Bank, your authentication was correct",
        send_data: null
    });
});
app.post('/createPayment', (req, res) => {
    const { payment, date } = req.body;
    if (typeof payment !== 'number' || typeof date !== 'string') {
        return res.status(400).send({
            message: 'Invalid payment or date format. Payment should be a number and date should be a string.',
        });
    }
    (0, databasemanage_1.createPayment)(payment, date, (err, type) => {
        if (err) {
            console.error('Error al crear el pago:', err.message);
            return res.status(500).send({
                message: 'Error creating payment',
                send_data: err.message,
            });
        }
        console.log(`Pago creado con tipo: ${type}`);
        res.send({
            message: 'Payment created successfully',
            send_data: type
        });
    });
});
app.post('/getTotal', (req, res) => {
    (0, databasemanage_1.getTotal)((total) => {
        res.status(200).send({
            message: 'Here is your total',
            send_data: total
        });
    });
});
app.post('/lastPayment', (req, res) => {
    (0, databasemanage_1.getLastPayment)((lastPayment, lastPaymentDate, lastPaymentId) => {
        res.send({
            message: 'Last payment details',
            send_data: { lastPayment, lastPaymentDate, lastPaymentId }
        });
    });
});
app.post('/getAllPayments', (req, res) => {
    (0, databasemanage_1.getAllPayments)((err, paymentList) => {
        if (err) {
            console.log("Error");
            res.status(500).send({
                message: 'A server error...',
                send_data: null
            });
        }
        else {
            res.status(200).send({
                message: 'No errors :)',
                send_data: paymentList
            });
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
