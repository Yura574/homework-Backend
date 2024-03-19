export type ReturnViewModelType<Items> = {
    pagesCount: number,
    totalCount: number,
    page: number,
    pageSize: number,
    items: Items
}