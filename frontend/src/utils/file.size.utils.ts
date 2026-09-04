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