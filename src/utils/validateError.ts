import {validationResult} from 'express-validator';
import {HTTP_STATUSES} from './httpStatuses';
import {Request, Response} from 'express';


export const ValidateError = (req: Request, res: Response) => {

    const result = validationResult(req)
    if (!result.isEmpty()) {
        const errors = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        console.log(errors)
        if (errors.errorsMessages[0] === 'not found') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return true;
        }
        console.log(123)
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return true
    }
    return false
}