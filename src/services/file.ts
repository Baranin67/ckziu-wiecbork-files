import fs from 'fs';
import path from 'path';
import busboy from 'busboy';

import type { FileWhere } from '../types/file';

import { File } from '../models/file';

import _put from '../api/files/_put';
import _get from '../api/files/_get';
import _patch from '../api/files/_patch';
import _delete from '../api/files/_delete';
import { Service } from './service';

export class FileService extends Service {
    constructor() {
        super('/files', { _put, _get, _patch, _delete });
    }
}
