import { Router } from 'express';

import { RouterHandlers } from '../types/api.js';

export class Service {
    private basePath: string;
    private handlers: RouterHandlers;

    constructor(basePath: string, handlers: RouterHandlers) {
        this.basePath = basePath;
        this.handlers = handlers;
    }

    setupRouter(router: Router) {
        if (this.handlers._put !== undefined)
            router.put(this.basePath, this.handlers._put);
        if (this.handlers._get !== undefined)
            router.get(this.basePath, this.handlers._get);
        if (this.handlers._patch !== undefined)
            router.patch(this.basePath, this.handlers._patch);
        if (this.handlers._delete !== undefined)
            router.delete(this.basePath, this.handlers._delete);
    }
}
