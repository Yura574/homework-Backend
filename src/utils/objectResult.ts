import {HttpStatusType} from "./httpStatuses";

export type ObjectResult<T> = {
    status: HttpStatusType
    errorMessage?: string
    data?: T
}

export enum ResultStatus {
    Success = 'success',
    NotFound = 'not found',
    Forbidden = 'forbidden',
    BadRequest = 'bad request',
    Unauthorized = 'unauthorized'
}