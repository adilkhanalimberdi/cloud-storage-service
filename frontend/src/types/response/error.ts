export type ErrorResponse = {
    statusCode: number;
    message: string;
    errors: Record<string, string>;
}