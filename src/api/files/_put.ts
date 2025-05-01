import busboy from 'busboy';
import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api';
import { FileRequestQuery } from '../../types/file';

export default async function (req: NodeRequest, res: NodeResponse) {
    // ZAPYTANIE

    const { path: reqPath, overrideName: reqOverrideName } =
        req.query as FileRequestQuery.Create;

    if (typeof reqPath !== 'string') {
        res.status(400).json({
            code: 400,
            type: 'BAD_REQ',
            missingParams: ['path']
        });
        return;
    }

    // KONFIGURACJA

    const bb = busboy({ headers: req.headers });
    const fullPath = path.join(process.cwd(), '/public/uploads', reqPath);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

    // ZAPISYWANIE PLIKU

    bb.on('file', (_, file, info) => {
        file.pipe(
            fs.createWriteStream(
                path.join(fullPath, reqOverrideName ?? info.filename)
            )
        );
    });

    // ODPOWIEDŹ

    bb.on('close', () => res.status(200).json({ code: 200 }));
    req.pipe(bb);
}
