export type ReturnViewModelType<Items> = {
    pagesCount: number,
    totalCount: number,
    page: number,
    pageSize: number,
    items: Items
}



export type FieldErrorType = {
    message: string
    field: string
}

export type ErrorResultModel = {
    errorsMessages: FieldErrorType[]
}
