import express, { Router } from 'express';

import { FileService } from './file.js';

export class RouterService {
    private router: Router;
    private fileService: FileService;

    constructor() {
        this.router = express.Router();
        this.fileService = new FileService();
    }

    setupRouter() {
        this.fileService.setupRouter(this.router);
    }

    getRouter() {
        return this.router;
    }
}
