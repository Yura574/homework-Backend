import {ObjectId} from "mongodb";
import  {Schema} from "mongoose";

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

export type UserInputModel = {
    login: string
    password: string
    email: string
}
export type UserMeModel = {
    email: string
    login: string
    userId: string
}


export type UserViewModel = {
    id: string
    login: string
    createdAt: string
    email: string
}
export type UserModel = {
    id: ObjectId,
    email: string,
    login: string,
    password: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date
        isConfirm: boolean
    }
}

export type UserCreateModel ={
    email: string,
    login: string,
    password: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date
        isConfirm: boolean
    }
}

export type UserUpdateModel = {
    email?: string,
    login?: string,
    password?: string,
    isConfirm?: boolean
    confirmationCode?: string,
    expirationDate?: Date
}

export type UserDBModel ={
    email: string,
    login: string,
    password: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date
        isConfirm: boolean
    }
}

export const UserSchema = new Schema<UserDBModel>({
    email: String,
    login: String,
    password: String,
    createdAt: String,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: String,
        isConfirm: Boolean
    }
})