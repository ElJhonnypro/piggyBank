"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPayments = exports.getLastPayment = exports.getTotal = exports.createPayment = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
// Conectar a la base de datos SQLite
const db = new sqlite3_1.default.Database('database.db');
// Ejecutar varias operaciones de base de datos de forma secuencial
db.serialize(() => {
    // Crear una tabla
    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payment REAL,
      date TEXT,
      type TEXT
    )`);
});
const createPayment = (payment, date, callback) => {
    const type = payment < 0 ? "negative" : "positive";
    db.run('INSERT INTO payments (payment, date, type) VALUES (?, ?, ?)', [payment, date, type], function (err) {
        if (err) {
            console.error('Error al insertar el pago:', err.message);
            callback(err, null);
            return;
        }
        console.log(`Nuevo pago insertado con ID: ${this.lastID}`);
        callback(null, type);
    });
};
exports.createPayment = createPayment;
const getTotal = (callback) => {
    db.get('SELECT SUM(payment) AS total FROM payments', (err, row) => {
        if (err) {
            console.error('Error al calcular el total:', err.message);
            callback(0);
        }
        else {
            callback(row.total || 0); // Maneja el caso donde row.total es null o undefined
        }
    });
};
exports.getTotal = getTotal;
const getLastPayment = (callback) => {
    db.get('SELECT id, payment, date FROM payments ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) {
            console.error('Error al obtener el último pago:', err.message);
            callback(0, '', 0);
        }
        else if (row) {
            callback(row.payment, row.date, row.id);
        }
        else {
            callback(0, '', 0); // Maneja el caso donde no se encuentran registros
        }
    });
};
exports.getLastPayment = getLastPayment;
const getAllPayments = (callback) => {
    db.all('SELECT * FROM payments', (err, rows) => {
        if (err) {
            console.error('Error al obtener los pagos:', err.message);
            callback(err, []);
        }
        else {
            callback(null, rows);
        }
    });
};
exports.getAllPayments = getAllPayments;
