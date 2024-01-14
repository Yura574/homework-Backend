export type BlogViewModelType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
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
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}