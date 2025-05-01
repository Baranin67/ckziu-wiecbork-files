import fs from 'fs';
import path from 'path';

import { NodeRequest, NodeResponse } from '../../types/api';
import { FileRequestQuery } from '../../types/file';
import { File } from '../../models/file';
import { Blob } from 'buffer';

export default async function (req: NodeRequest, res: NodeResponse) {
    // ZAPYTANIE

    const select = req.query.select as FileRequestQuery.View['select'];
    const where = req.query.where as FileRequestQuery.View['where'];
    const orderBy = req.query.orderBy as FileRequestQuery.View['orderBy'];
    const page = parseInt(
        String(req.query.page)
    ) as FileRequestQuery.View['page'];
    const perPage = parseInt(
        String(req.query.perPage)
    ) as FileRequestQuery.View['perPage'];

    if (
        (req.query.select !== undefined && typeof select !== 'object') ||
        (req.query.where !== undefined && typeof where !== 'object') ||
        (req.query.orderBy !== undefined && typeof orderBy !== 'object') ||
        (req.query.page !== undefined && isNaN(page)) ||
        (req.query.perPage !== undefined && isNaN(perPage))
    ) {
        res.status(400).json({
            code: 400,
            type: 'BAD_REQ'
        });
        return;
    }

    Object.keys(where).forEach(key => {
        if (where[key] === 'true') where[key] = true;
        else if (where[key] === 'false') where[key] = false;
        else if (!isNaN(parseInt(where[key])))
            where[key] = parseInt(where[key]);
        else if (!isNaN(parseFloat(where[key])))
            where[key] = parseFloat(where[key]);
    });

    // KONFIGURACJA

    const absPath = path.join(process.cwd(), '/public/uploads', where.path);

    const files = fs.readdirSync(absPath);

    if (files === null) {
        res.status(500).send({
            code: 500,
            type: 'UNKNOWN'
        });
        return;
    }

    let filteredFiles: Partial<File>[] = [];

    if (where.name !== undefined)
        filteredFiles = files
            .filter(file => file === where.name)
            .map(file => new File(file, where.path, null, null, null, null));

    const filesReadStatus: boolean[] = filteredFiles.map(() => false);

    filteredFiles.forEach((file, fileIdx) => {
        const fileAbsPath = path.join(absPath, file.name);
        const fileStream = fs.createReadStream(fileAbsPath);
        const fileStats = fs.statSync(fileAbsPath);

        file.size = fileStats.size;
        file.createdAt = fileStats.birthtime;
        file.updatedAt = fileStats.birthtime;

        let fileBlob = '';
        fileStream.on('readable', () => {
            let chunk;
            while (null !== (chunk = fileStream.read())) {
                fileBlob += chunk;
            }
        });

        fileStream.on('end', () => {
            file.blob = new Blob([fileBlob]);
            filesReadStatus[fileIdx] = true;

            console.log(fileBlob);

            if (filesReadStatus.every(s => s)) {
                res.status(200).json({
                    code: 200,
                    data:
                        select === undefined
                            ? filteredFiles
                            : filteredFiles.map(file => {
                                  Object.keys(select)
                                      .filter(key => select[key])
                                      .map(key => ({
                                          [key]: file[key]
                                      }));
                              })
                });
            }
        });
    });

    // const bb = busboy({ headers: req.headers });
    // const fullPath = path.join(process.cwd(), '/public/uploads', reqPath);
    // if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

    // // ZAPISYWANIE PLIKU

    // bb.on('file', (_, file, info) => {
    //     file.pipe(
    //         fs.createWriteStream(
    //             path.join(fullPath, reqOverrideName ?? info.filename)
    //         )
    //     );
    // });

    // // ODPOWIEDŹ

    // bb.on('close', () => res.status(200).json({ code: 200 }));
    // req.pipe(bb);
}
