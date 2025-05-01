import fs from 'fs';

import { NodeRequest, NodeResponse } from '../../types/api';
import { FileRequestBody, FileRequestQuery } from '../../types/file';
import path from 'path';

export default async function (req: NodeRequest, res: NodeResponse) {
    const { name: currentName, path: currentPath } =
        req.query as FileRequestQuery.Patch;
    const reqBody = req.body as FileRequestBody.Patch;

    if (
        currentName === undefined ||
        currentPath === undefined ||
        reqBody?.data === undefined
    ) {
        const missingParams = [];
        if (currentName === undefined) missingParams.push('name');
        if (currentPath === undefined) missingParams.push('path');
        if (reqBody?.data === undefined) missingParams.push('data');

        res.status(400).json({
            code: 400,
            type: 'BAD_REQ',
            missingParams
        });
        return;
    }

    const { name: newName, path: newPath } = reqBody.data;

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
