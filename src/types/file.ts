export type File = {
    name: string;
    path: string;
    size: number;
    blob: Blob;
    createdAt: Date;
    updatedAt: Date;
};

export type FileSelect = {
    [key in keyof File]?: boolean;
};

export type FileWhere = {
    [key in keyof File]?: File[key];
};

export type FileOrderBy = {
    [key in keyof File]?: 'asc' | 'desc';
};

export namespace FileRequestQuery {
    export type Create = {
        path: string;
        overrideName?: string;
    };
    export type View = {
        select?: FileSelect;
        where?: FileWhere;
        orderBy?: FileOrderBy;
        page?: number;
        perPage?: number;
    };
    export type Patch = {
        name: string;
        path: string;
    };
    export type Delete = {
        name: string;
        path: string;
    };
}

export namespace FileRequestBody {
    export type Patch = {
        data: Pick<Partial<File>, 'name' | 'path'>;
    };
}
