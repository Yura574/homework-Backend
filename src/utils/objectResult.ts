export type ObjectResult<T = null> = {
    status: ResultStatus
    errorMessage?: string | [{field: string, message: string}]
    data: T
}

export enum ResultStatus {
    Success = 'success',
    Created = 'created',
    NoContent = 'no content',
    NotFound = 'not found',
    Forbidden = 'forbidden',
    BadRequest = 'bad request',
    Unauthorized = 'unauthorized',
    SomethingWasWrong = 'something was wrong'
}