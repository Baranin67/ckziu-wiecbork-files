import fs from 'fs';
import path from 'path';
import mime from 'mime';

import { NodeRequest, NodeResponse } from '../../types/api.js';
import { File, FileRequestOptions } from '../../types/file.js';

import { parseQueryString } from '../../utils/api.js';

export default async function (req: NodeRequest, res: NodeResponse) {
    // ŻĄDANIE

    const options = parseQueryString(req) as FileRequestOptions.View;

    if (options.fields === undefined) {
        res.status(400).json({
            code: 400,
            type: 'BAD_REQ'
        });
        return;
    }

    // KONFIGURACJA

    const dirAbsPath = path.join(
        process.cwd(),
        '/public/uploads',
        options.filters.path
    );

    // POBIERANIE
    // wpisów katalogu

    let dirEntries = fs.readdirSync(dirAbsPath, { withFileTypes: true });

    // FILTROWANIE

    if (options.filters.path !== undefined)
        dirEntries = dirEntries.filter(
            dirEnt => dirEnt.parentPath === options.filters.path
        );

    if (options.filters.isDirectory !== undefined)
        dirEntries = dirEntries.filter(dirEnt => {
            console.log(
                dirEnt.isDirectory(),
                '===',
                options.filters.isDirectory,
                ':',
                dirEnt.isDirectory() === options.filters.isDirectory
            );
            return dirEnt.isDirectory() === options.filters.isDirectory;
        });

    // MAPOWANIE
    // wpisów na obiekty `File`

    const files: Partial<File>[] = dirEntries.map(dirEntry => {
        const isEntryDir = dirEntry.isDirectory();
        const entryAbsPath = path.join(dirAbsPath, dirEntry.name);
        const entryStats = fs.statSync(entryAbsPath);

        let fileMimeType = isEntryDir ? null : mime.getType(entryAbsPath);

        return {
            name: dirEntry.name,
            path: options.filters.path,
            isDirectory: isEntryDir,
            createdAt: entryStats.birthtime,
            updatedAt: entryStats.mtime,
            size: isEntryDir ? null : entryStats.size,
            mimeType: fileMimeType
        };
    });

    // ODPOWIEDŹ

    res.status(200).json({
        code: 200,
        data: files.map(file => {
            let filteredFile = {};

            Object.keys(options.fields).forEach(field => {
                filteredFile = { ...filteredFile, [field]: file[field] };
            });

            return filteredFile;
        })
    });
}
