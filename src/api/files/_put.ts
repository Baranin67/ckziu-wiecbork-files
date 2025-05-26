import busboy from 'busboy';
import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api.js';
import { FileRequestOptions } from '../../types/file.js';

export default async function (req: NodeRequest, res: NodeResponse) {
    // ZAPYTANIE

    const options = req.query as FileRequestOptions.Create;

    // TODO override names

    if (options.fileOptions?.path === undefined) {
        res.status(400).json({
            code: 400,
            type: 'BAD_REQ',
            missingParams: ['path']
        });
        return;
    }

    // KONFIGURACJA

    const bb = busboy({ headers: req.headers });
    const fullPath = path.join(
        process.cwd(),
        '/public',
        options.fileOptions.path
    );
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

    // ZAPISYWANIE PLIKU

    let currentFileIdx = 0;

    bb.on('file', (_, file, info) => {
        file.pipe(
            fs.createWriteStream(
                path.join(
                    fullPath,
                    options.fileOptions.overrideNames?.[currentFileIdx] ??
                        info.filename
                )
            )
        );
        currentFileIdx++;
    });

    // ODPOWIEDŹ

    bb.on('close', () => res.status(200).json({ code: 200 }));
    req.pipe(bb);
}
