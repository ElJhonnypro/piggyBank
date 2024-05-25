import sqlite3 from 'sqlite3';

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('database.db');

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

export const createPayment = (payment: number, date: string, callback: (err: Error | null, type: string | null) => void): void => {
    const type = payment < 0 ? "negative" : "positive";

    db.run('INSERT INTO payments (payment, date, type) VALUES (?, ?, ?)', [payment, date, type], function (err: Error | null) {
        if (err) {
            console.error('Error al insertar el pago:', err.message);
            callback(err, null);
            return;
        }
        console.log(`Nuevo pago insertado con ID: ${this.lastID}`);
        callback(null, type);
    });
};

export const getTotal = (callback: (total: number) => void): void => {
    db.get('SELECT SUM(payment) AS total FROM payments', (err: Error | null, row: { total: number }) => {
        if (err) {
            console.error('Error al calcular el total:', err.message);
            callback(0);
        } else {
            callback(row.total || 0);  // Maneja el caso donde row.total es null o undefined
        }
    });
};

export const getLastPayment = (callback: (lastPayment: number, lastPaymentDate: string, lastPaymentId: number) => void): void => {
    db.get('SELECT id, payment, date FROM payments ORDER BY id DESC LIMIT 1', (err: Error | null, row: { id: number, payment: number, date: string }) => {
        if (err) {
            console.error('Error al obtener el último pago:', err.message);
            callback(0, '', 0);
        } else if (row) {
            callback(row.payment, row.date, row.id);
        } else {
            callback(0, '', 0);  // Maneja el caso donde no se encuentran registros
        }
    });
};

export const getAllPayments = (callback: (err: Error | null, paymentsList: Array<{ id: number, payment: number, date: string, type: string }>) => void): void => {
    db.all('SELECT * FROM payments', (err: Error | null, rows: Array<{ id: number, payment: number, date: string, type: string }>) => {
        if (err) {
            console.error('Error al obtener los pagos:', err.message);
            callback(err, []);
        } else {
            callback(null, rows);
        }
    });
};