export type ReturnViewModelType<Items> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Items
}
export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    "createdAt": string,
    "isMembership": boolean
}
export type BlogInputModelType = {
    name: string
    description: string
    websiteUrl: string
}

export type PostInputModelType = {
    blogId: string
    title: string
    shortDescription: string
    content: string
}
export type PostInputType = {
    title: string
    shortDescription: string
    content: string
}
export type PostViewModelType = {
    id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type ReturnPostsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: {
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: string
    }[]
}