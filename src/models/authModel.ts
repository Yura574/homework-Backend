export type ConfirmEmailQuery = {
    email: string
    code: string
}
export type ResendingEmailBody = {
    email: string
}
export type RegistrationConfirmationCodeModel = {
    code: string
}

export type LoginResponse = {
    accessToken: string
    // refreshToken: { refreshToken: string }
}

export type TokenResponseModel = {
    accessToken: {
        accessToken: string
    }
    refreshToken: {
        refreshToken: string
    }
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