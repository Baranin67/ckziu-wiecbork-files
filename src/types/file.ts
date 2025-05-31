export type File = {
    path: string;
    isDirectory: boolean;
    createdAt: Date;
    updatedAt: Date;
    mimeType: string | null;
    size: number | null;
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

export namespace FileRequestOptions {
    export type Create = {
        fileOptions: {
            path: string;
            overrideNames?: string[];
        };
    };
    export type View = {
        fields?: FileSelect;
        filters?: FileWhere;
        orderBy?: FileOrderBy;
        skip?: number;
        take?: number;
    };
    export type Patch = {
        filters?: FileWhere;
    };
    export type Delete = {
        filters?: FileWhere;
        limit?: number;
    };
}

export namespace FileRequestBody {
    export type Patch = {
        data: Pick<Partial<File>, 'path'>;
    };
}
