import { RouterService } from '../services/router';

export class RouterController {
    private routerService: RouterService;

    constructor() {
        this.routerService = new RouterService();
    }

    setupRouter() {
        this.routerService.setupRouter();
    }

    getRouter() {
        return this.routerService.getRouter();
    }
}
