import { FileService } from '../../services/file';
import { NodeRequest, NodeResponse } from '../../types/api';

export default async function (req: NodeRequest, res: NodeResponse) {
    const fileService = new FileService();

    fileService.updateFiles(req.body.filters, req.body.data);
    res.status(200);
}
