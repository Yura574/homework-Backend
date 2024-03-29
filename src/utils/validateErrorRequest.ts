import {validationResult} from 'express-validator';
import {HTTP_STATUSES} from './httpStatuses';
import {Request, Response} from 'express';
import {ErrorResultModel} from "../models/commonModels";


export const ValidateErrorRequest = (req: Request, res: Response) => {

    const result = validationResult(req)
    if (!result.isEmpty()) {
        const errors: ErrorResultModel = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        if (errors.errorsMessages[0].field === 'id') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return true;
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return true
    }
    return false
}