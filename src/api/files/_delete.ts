import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api.js';
import { FileRequestOptions } from '../../types/file.js';

export default async function (req: NodeRequest, res: NodeResponse) {
    // ZAPYTANIE

    const options = req.query as FileRequestOptions.Delete;

    if (options.filters.path === undefined) {
        const missingParams = [];
        if (options.filters.path === undefined) missingParams.push('path');

        res.status(400).json({ code: 400, type: 'BAD_REQ', missingParams });
        return;
    }

    // KONFIGURACJA

    const absPath = path.join(
        process.cwd(),
        '/public/uploads',
        options.filters.path
    );

    if (!fs.existsSync(absPath)) {
        res.status(400).json({ code: 400, type: 'FILE_UNKNOWN' });
        return;
    }

    // USUWANIE PLIKU + ODPOWIEDŹ

    fs.rm(absPath, err => {
        if (err) {
            res.status(500).json({ code: 500, type: 'UNKNOWN' });
            return;
        }
        res.status(200).json({ code: 200 });
    });
}
