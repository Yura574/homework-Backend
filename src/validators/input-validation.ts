import {NextFunction, Response, Request} from 'express';
import {ValidationError, validationResult} from 'express-validator';

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const formattedError = validationResult(req).formatWith((error: ValidationError) => ({
        message: error.msg,
        field: error.type === 'field' ? error.path : 'unknown'
    }))
}