export type CreateUserModel = {
    userName: string
}


export type GetUsersQuery = {
    sortBy: string,
    sortDirection: 'asc'| 'desc',
    pageNumber: string,
    pageSize: string,
    searchLoginTerm: string
    searchEmailTerm: string
}


export type UserItemType ={
    id: string,
    login: string,
    email: string,
    createdAt: string
}
