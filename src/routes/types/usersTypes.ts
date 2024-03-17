



export type CreateUserBodyType = {
    login: string,
    password: string,
    email: string
}


export type  NewUserType = {
    login: string
    password: string
    email: string
    createdAt: string
}

export type ReturnsUserType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

