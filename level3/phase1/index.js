
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 7000;

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        message: `Hello from ${process.env.SERVER_NAME}`
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`${process.env.SERVER_NAME} running on port ${PORT}`);
});
