import { Request, Response } from 'express';

export type NodeRequest = Request;
export type NodeResponse = Response;

export type RouterHandler = (req: NodeRequest, res: NodeResponse) => void;

export type RouterHandlers = {
    _get?: RouterHandler;
    _put?: RouterHandler;
    _patch?: RouterHandler;
    _delete?: RouterHandler;
};
