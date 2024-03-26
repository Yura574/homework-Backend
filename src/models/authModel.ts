export type ConfirmEmailQuery = {
    email: string
    code: string
}
export type ResendingEmailBody = {
    email: string
}

export type LoginResponse = {
    accessToken: String
}

export type LoginInputModel = {
    loginOrEmail: string,
    password: string
}

export type LoginSuccessViewModel = {
    accessToken: string
}


export type MeViewModel = {
    email: string
    login: string
    userId: string
}