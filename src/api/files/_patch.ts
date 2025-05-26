import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api.js';
import { FileRequestBody, FileRequestOptions } from '../../types/file.js';

export default async function (req: NodeRequest, res: NodeResponse) {
    const options = req.query as FileRequestOptions.Delete;
    const data = (req.body as FileRequestBody.Patch).data;

    const currentName = options.filters?.name;
    const currentPath = options.filters?.path;

    if (
        currentName === undefined ||
        currentPath === undefined ||
        data === undefined
    ) {
        res.status(400).json({
            code: 400,
            type: 'BAD_REQ'
        });
        return;
    }

    const { name: newName, path: newPath } = data;

    const currentAbsPath = path.join(
        process.cwd(),
        '/public/uploads',
        currentPath,
        currentName
    );

    if (!fs.existsSync(currentAbsPath)) {
        res.status(400).json({ code: 400, type: 'FILE_UNKNOWN' });
        return;
    }

    const newAbsPath = path.join(
        process.cwd(),
        '/public/uploads',
        typeof newPath === 'string' ? newPath : currentPath,
        typeof newName === 'string' ? newName : currentName
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
