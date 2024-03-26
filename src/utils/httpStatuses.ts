




export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_AUTHORIZATION_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,

    SOMETHING_WAS_WRONG_500: 500
}

type HttpKeys = keyof typeof HTTP_STATUSES
export type HttpStatusType = (typeof HTTP_STATUSES)[HttpKeys]