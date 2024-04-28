import {GetUsersQuery, UserCreateModel, UserModel} from "../models/userModels";
import {ErrorType} from "../utils/objectResult";
import {UsersModel} from "../db/db";

export class UserRepository {
    static async findUser(loginOrEmail: string) {
        return UsersModel.findOne({
            $or: [
                {login: {$regex: loginOrEmail}},
                {email: {$regex: loginOrEmail}}
            ]
        })

    }

    static async uniqueUser(email: string, login: string): Promise<ErrorType[]> {

        const errors: ErrorType[] = []
        const userEmail = await UsersModel.findOne({email: {$regex: email}})
        if (userEmail) {
            errors.push({field: 'email', message: 'email already exist'})
        }

        const userLogin = await UsersModel.findOne({login: {$regex: login}})
        if (userLogin) {
            errors.push({field: 'login', message: 'login already exist'})
        }

        return errors
    }

    static async getAllUsers(data: GetUsersQuery) {

        const {
            pageSize
                = 10,
            pageNumber = '1',
            sortBy = 'createdAt',
            sortDirection = 'desc',
            searchEmailTerm = null,
            searchLoginTerm = null,
        } = data

        const totalCount = await UsersModel.countDocuments({
            $or: [
                {login: {$regex: searchLoginTerm ? new RegExp(searchLoginTerm, 'i') : ''}},
                {email: {$regex: searchEmailTerm ? new RegExp(searchEmailTerm, 'i') : ''}}
            ]

        })
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const skip = (+pageNumber - 1) * +pageSize
        let sort: any = {}
        sort[sortBy] = sortDirection === 'asc' ? 1 : -1
        const users = await UsersModel.find({
            $or: [
                {login: {$regex: searchLoginTerm ? new RegExp(searchLoginTerm, 'i') : ''}},
                {email: {$regex: searchEmailTerm ? new RegExp(searchEmailTerm, 'i') : ''}}
            ]
        }).sort(sort).skip(skip).limit(+pageSize).lean()

        return {users, totalCount, pagesCount, pageNumber, pageSize}
    }

    static async createUser(user: UserCreateModel) {
        const createdUser = new UsersModel(user)
        await createdUser.save()
        return createdUser

    }

    static async getUserById(userId: string) {
        return UsersModel.findById({_id: userId})
    }

    static async updateUser(data: UserModel) {
        await UsersModel.replaceOne({_id: data.id}, data)
    }

    static async deleteUser(id: string) {
        const isDeleted = await UsersModel.deleteOne({_id: id})
        return !!isDeleted.deletedCount;
    }
}