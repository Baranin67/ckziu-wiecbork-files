import busboy from 'busboy';
import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api';
import { FileRequestQuery } from '../../types/file';

export default async function (req: NodeRequest, res: NodeResponse) {
    // ZAPYTANIE

    const { path: reqPath, name: reqName } =
        req.query as FileRequestQuery.Delete;

    const isPathGiven = typeof reqPath === 'string';
    const isNameGiven = typeof reqName === 'string';

    if (!isPathGiven || !isNameGiven) {
        const missingParams = [];
        if (!isPathGiven) missingParams.push('path');
        if (!isNameGiven) missingParams.push('name');

        res.status(400).json({ code: 400, type: 'BAD_REQ', missingParams });
        return;
    }

    // KONFIGURACJA

    const absPath = path.join(
        process.cwd(),
        '/public/uploads',
        reqPath,
        reqName
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
