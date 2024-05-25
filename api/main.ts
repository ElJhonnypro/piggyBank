import express, { Request, Response, NextFunction } from 'express';
import { createPayment, getTotal, getLastPayment, getAllPayments } from './databasemanage';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 2345;

app.use(cors());

app.use(bodyParser.json()); // Add body-parser middleware to parse JSON bodies

// Middleware para verificar la contraseña de la API
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    console.log("primera entrada")
    const { passwordapi } = req.body;
    if (passwordapi === 'myapipassword') {
      console.log("correcto")
        next();
    } else {
        res.status(401).send({
            message: 'Your API password is incorrect',
        });
    }
});

app.get('/info', (req: Request, res: Response) => {
    res.send({
        message: "Welcome to Jhon's Piggy Bank, you need authentication in /info",
        send_data: null
    });
});

app.post('/', (req: Request, res: Response) => {
    res.send({
        message: "Welcome to Jhon's Piggy Bank, your authentication was correct",
        send_data: null
    });
});

app.post('/createPayment', (req: Request, res: Response) => {
    const { payment, date } = req.body;
    if (typeof payment !== 'number' || typeof date !== 'string') {
        return res.status(400).send({
            message: 'Invalid payment or date format. Payment should be a number and date should be a string.',
        });
    }
    createPayment(payment, date, (err: Error | null, type: string | null) => {

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

app.post('/getTotal', (req: Request, res: Response) => {
    getTotal((total: number) => {
        res.status(200).send({
            message: 'Here is your total',
            send_data: total
        });
    });
});

app.post('/lastPayment', (req: Request, res: Response) => {
    getLastPayment((lastPayment: number, lastPaymentDate: string, lastPaymentId: number) => {
        res.send({
            message: 'Last payment details',
            send_data: { lastPayment, lastPaymentDate, lastPaymentId }
        });
    });
});

app.post('/getAllPayments', (req: Request, res: Response) => {
  console.log("entrando")
    getAllPayments((err: Error | null, paymentList?: any[]) => {
        if (err) {
            console.log("Error");
            res.status(500).send({
                message: 'A server error...',
                send_data: null
            });
        } else {
            res.status(200).send({
                message: 'No errors :)',
                send_data: paymentList
            });
        }
    });
    console.log("saliendo")
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
