import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api.js';
import { FileRequestOptions } from '../../types/file.js';

export default async function (req: NodeRequest, res: NodeResponse) {
    // ZAPYTANIE

    const options = req.query as FileRequestOptions.Delete;

    if (options.filters.paths === undefined) {
        const missingParams = [];
        if (options.filters.paths === undefined) missingParams.push('paths');

        res.status(400).json({ code: 400, type: 'BAD_REQ', missingParams });
        return;
    }

    // KONFIGURACJA

    const absBasePath = path.join(process.cwd(), '/public');

    if (!fs.existsSync(absBasePath)) {
        res.status(400).json({ code: 400, type: 'FILE_UNKNOWN' });
        return;
    }

    // USUWANIE PLIKÓW + ODPOWIEDŹ

    let fsIterator = 0;
    let fsErrorFilesPaths: string[] = [];

    options.filters.paths.forEach(filePath => {
        const absPath = path.join(absBasePath, filePath);

        fs.rm(absPath, err => {
            fsIterator++;

            if (err) fsErrorFilesPaths.push(filePath);

            if (fsIterator === options.filters.paths.length) {
                res.status(200).json({
                    code: 200,
                    notDeletedFiles: fsErrorFilesPaths
                });
            }
        });
    });
}
