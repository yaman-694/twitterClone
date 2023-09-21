import { logCatchError } from "./logger";

const errorHandler = async (err: any, req: any, res: any, next: any) => {
    logCatchError.error(err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Oops! Something went wrong.'
        }
    });
};

export default errorHandler;