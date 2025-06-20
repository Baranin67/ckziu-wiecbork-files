import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api.js';
import { FileRequestBody, FileRequestOptions } from '../../types/file.js';

export default async function (req: NodeRequest, res: NodeResponse) {
    const options = req.query as FileRequestOptions.Patch;
    const data = (req.body as FileRequestBody.Patch).data;

    const currentPath = options.filters?.path;

    if (currentPath === undefined || data === undefined) {
        res.status(400).json({
            code: 400,
            type: 'BAD_REQ'
        });
        return;
    }

    const { path: newPath } = data;

    const currentAbsPath = path.join(process.cwd(), '/public', currentPath);

    if (!fs.existsSync(currentAbsPath)) {
        res.status(400).json({ code: 400, type: 'FILE_UNKNOWN' });
        return;
    }

    const newAbsPath = path.join(
        process.cwd(),
        '/public/uploads',
        typeof newPath === 'string' ? newPath : currentPath
    );

    if (newAbsPath !== currentAbsPath) {
        const newAbsPathDirname = path.dirname(newAbsPath);
        if (!fs.existsSync(newAbsPathDirname))
            fs.mkdirSync(newAbsPathDirname, { recursive: true });

        fs.rename(currentAbsPath, newAbsPath, err => {
            if (err) res.status(500).json({ code: 500, type: 'UNKNOWN' });
        });
    }

    res.status(200).json({ code: 200 });
}
