const MAX_SINGLE_FILE_SIZE = import.meta.env.MAX_SINGLE_FILE_SIZE;
const MAX_TOTAL_SIZE = import.meta.env.MAX_TOTAL_SIZE;

export function getFileSize(fileBytes: bigint | number): string {
    const bytes = Number(fileBytes);

    if (!bytes || bytes <= 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);

    const formattedSize = Number.isInteger(size) ? size.toString() : size.toFixed(1);

    return `${formattedSize} ${sizes[i]}`;
}

export function validate(files: File[]): string | null {
    let totalSize = 0;

    for (const file of files) {
        if (file.size > MAX_SINGLE_FILE_SIZE) {
            return `The file ${file.name} is too large.`;
        }
        totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
        return `The total file size exceeds ${MAX_TOTAL_SIZE}`;
    }

    return null;
}