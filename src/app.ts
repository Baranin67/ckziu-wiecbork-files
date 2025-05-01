import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { RouterController } from './controllers/router';

// INICJALIZACJA

const app = express();
const PORT = process.env.PORT || 3001;

// ROUTER

const routerController = new RouterController();
routerController.setupRouter();

const router = routerController.getRouter();
app.use('/api', router);

// MIDDLEWARE

app.use(
    cors({
        methods: process.env.ALLOW_METHODS,
        origin: process.env.ALLOW_ORIGIN
    })
);
app.use(bodyParser.json());

// START

app.listen(PORT, err => {
    if (err) {
        console.error(err.message);
        return;
    }

    console.log(`Listening on port ${PORT}...`);
});
