
export type BlogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMemberShip: boolean
}

export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogPostInputModel = {
    title: string,
    shortDescription: string,
    content: string
}
