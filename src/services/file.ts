import _put from '../api/files/_put.js';
import _patch from '../api/files/_patch.js';
import _delete from '../api/files/_delete.js';

import { Service } from './service.js';

export class FileService extends Service {
    constructor() {
        super('/files', { _put, _patch, _delete });
    }
}
