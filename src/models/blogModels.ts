export type BlogViewModelType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    "createdAt": string,
    "isMembership": boolean
}
export type BlogInputModelType= {
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
export type PostViewModelType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string

}