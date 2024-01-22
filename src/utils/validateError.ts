import {Result, ValidationError, validationResult} from 'express-validator';
import {HTTP_STATUSES} from './httpStatuses';


export const ValidateError = (result: Result<ValidationError>) => {

    if (!result.isEmpty()) {
        const errors = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        // if(errors.errorsMessages[0].field === 'id'){
        //     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        //     return;
        // }
        // res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return errors;
    }
    return
}