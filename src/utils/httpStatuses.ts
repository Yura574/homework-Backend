




export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    CHANGE_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

type HttpKeys = keyof typeof HTTP_STATUSES
export type HttpStatusType = (typeof HTTP_STATUSES)[HttpKeys]