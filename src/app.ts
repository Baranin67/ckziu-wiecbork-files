import express from 'express';
import cors from 'cors';
import { exit } from 'process';
import dotenv from 'dotenv';

import { RouterController } from './controllers/router';
import path from 'path';

// INICJALIZACJA

dotenv.config();

const app = express();

const serverPortRaw = process.env.SERVER_PORT;
const corsAllowMethods = process.env.ALLOW_METHODS;
const corsAllowOrigin = process.env.ALLOW_ORIGIN;

// WERYFIKACJA ZMIENNYCH ŚRODOWISKOWYCH

if (
    serverPortRaw === undefined ||
    corsAllowMethods === undefined ||
    corsAllowOrigin === undefined
) {
    console.error(
        '[Error] Some of the required environment variables not set: SERVER_PORT, ALLOW_METHODS and ALLOW_ORIGIN'
    );
    exit(1);
}

const serverPort = parseInt(serverPortRaw);

if (isNaN(serverPort)) {
    console.error('[Error] SERVER_PORT must be a number!');
    exit(1);
}

// MIDDLEWARE

const publicDirAbsPath = path.join(process.cwd(), '/public');
app.use('/public', express.static(publicDirAbsPath));

app.use(express.json());
app.use(
    cors({
        methods: corsAllowMethods,
        origin: corsAllowOrigin
    })
);
app.use((req, _, next) => {
    console.debug(`${req.method} ${req.path} from ${req.hostname}`);
    console.debug(`⌊ Params: ${JSON.stringify(req.query)}`);
    next();
});

// ROUTERY

const routerController = new RouterController();
routerController.setupRouter();

const router = routerController.getRouter();
app.use('/api', router);

// START

app.listen(serverPort, err => {
    if (err) {
        console.error(`[Error] ${err.name}: ${err.message}`);
        return;
    }

    console.log(`Listening on port ${serverPort}...`);
});
