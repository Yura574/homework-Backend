import {ObjectResult, ResultStatus} from "./objectResult";
import {Response} from 'express'
import {HTTP_STATUSES} from "./httpStatuses";


export const handleErrorObjectResult = (result: ObjectResult<any | null>, res: Response) => {
    if (result.status === ResultStatus.BadRequest) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorMessage)
    if (result.status === ResultStatus.Unauthorized) return res.status(HTTP_STATUSES.NOT_AUTHORIZATION_401).send(result.errorMessage)
    if (result.status === ResultStatus.Forbidden) return res.status(HTTP_STATUSES.FORBIDDEN_403).send(result.errorMessage)
    if (result.status === ResultStatus.NotFound) return res.status(HTTP_STATUSES.NOT_FOUND_404).send(result.errorMessage)
    return res.status(HTTP_STATUSES.SOMETHING_WAS_WRONG_500).send(result.errorMessage)
}