import {ErrorsType, ErrorType} from "./objectResult";


export const validateError = (errors: ErrorType[]): ErrorsType => {
    return {
        errorsMessages: errors.map(error => {
            return {
                field: error.field,
                message: error.message
            }
        })
    }
}