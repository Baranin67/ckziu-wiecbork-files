import { NodeRequest, NodeResponse } from '../../types/api';

export default async function (req: NodeRequest, res: NodeResponse) {
    res.status(200);
}
