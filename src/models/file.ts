export class File {
    name: string;
    path: string;
    size: number;
    blob: Blob;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        name: string,
        path: string,
        size: number,
        blob: Blob,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.name = name;
        this.path = path;
        this.size = size;
        this.blob = blob;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
