import * as axios from "axios";
import toast from "react-hot-toast";
import type {ErrorResponse} from "../types/response/error.ts";

export const handleError = (err: Error, defaultMessage: string = "Internal Server Error") => {
    if (axios.isAxiosError(err)) {
        const error: ErrorResponse = err.response?.data;

        if (error.errors) {
            Object.values(error.errors).forEach((message) => {
                toast.error(message);
            });
            return;
        }

        toast.error(error.message || defaultMessage);
    } else {
        toast.error(defaultMessage);
    }
}