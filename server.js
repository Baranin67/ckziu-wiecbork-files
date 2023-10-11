const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const busboy = require('busboy');
const path = require('path');

const messages = require('./cfg/messages.json');
const serverCfg = require('./cfg/server.json');

const app = express();
const PORT = serverCfg.port;
const PUBLIC_FOLDER = serverCfg.publicFolderPath;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + PUBLIC_FOLDER));

app.get('/list-files', (req, res) => {
	let { path, limit, page } = req.query;
	page--;

	console.log(page, limit);

	fs.readdir(__dirname + PUBLIC_FOLDER + (path || '/'), (err, files) => {
		if (err) {
			res.status(500).send({
				error: true,
				message:
					err.code === 'ENOENT'
						? messages.ERR_INVALID_PATH
						: messages.ERR_UNKNOWN_EXCEPTION,
			});
			return;
		}

		res.status(200).send({
			files: limit !== undefined ? files.splice(limit * page, limit) : files,
		});
	});
});

app.put('/file', (req, res) => {
	const { path: filePath, overrideName } = req.query;
	const bb = busboy({ headers: req.headers });
	const fullPath = path.join(__dirname, PUBLIC_FOLDER, filePath);

	bb.on('file', (_, file, info) => {
		file.pipe(
			fs.createWriteStream(path.join(fullPath, overrideName || info.filename))
		);
	});

	bb.on('close', () => res.status(200).end());
	req.pipe(bb);
});

app.get('/file', (req, res) => {
	const { path: filePath } = req.query;
	const fullPath = path.join(__dirname, PUBLIC_FOLDER, filePath);
	const rs = fs.createReadStream(fullPath);

	rs.on('data', data => {
		res.write(data);
	});

	rs.on('close', _ => res.status(200).end());
});

app.get('/file/info', (req, res) => {
	const { path: filePath } = req.query;

	fs.stat(filePath, (err, stats) => {
		res.status(err ? 500 : 200).json({
			error: err !== null,
			...{
				size: stats.size,
				updatedAt: stats.mtime,
				createdAt: stats.birthtime,
			},
		});
	});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));