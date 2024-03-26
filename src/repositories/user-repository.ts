import {GetUsersQuery, UserCreateModel, UserModel} from "../models/userModels";
import {userCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class UserRepository {
    static async findUser(loginOrEmail: string) {
        return await userCollection.findOne({
            $or: [
                {login: {$regex: loginOrEmail}},
                {email: {$regex: loginOrEmail}}
            ]
        })

    }

    static async uniqueUser(email: string, login: string) {

        const userEmail = await userCollection.findOne({email: {$regex: email}})
        if (userEmail) return {errorMessage: 'email already exist'}

        const userLogin = await userCollection.findOne({login: {$regex: login}})
        if (userLogin) return {errorMessage: 'login already exist'}

        return null
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

        const totalCount = await userCollection.countDocuments({
            $or: [
                {login: {$regex: searchLoginTerm ? new RegExp(searchLoginTerm, 'i') : ''}},
                {email: {$regex: searchEmailTerm ? new RegExp(searchEmailTerm, 'i') : ''}}
            ]

        })
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const skip = (+pageNumber - 1) * +pageSize
        let sort: any = {}
        sort[sortBy] = sortDirection === 'asc' ? 1 : -1
        const users = await userCollection.find({
            $or: [
                {login: {$regex: searchLoginTerm ? new RegExp(searchLoginTerm, 'i') : ''}},
                {email: {$regex: searchEmailTerm ? new RegExp(searchEmailTerm, 'i') : ''}}
            ]
        }).sort(sort).skip(skip).limit(+pageSize).toArray()

        return {users, totalCount, pagesCount, pageNumber, pageSize}
    }

    static async createUser(user: UserCreateModel) {

        const createdUser = await userCollection.insertOne(user)
        return await userCollection.findOne({_id: createdUser.insertedId})

    }

    static async getUserById(userId: ObjectId) {
        return await userCollection.findOne({_id: userId})
    }

    static async updateUser(data: UserModel) {
        await userCollection.replaceOne({_id: data.id}, data)
    }

    static async deleteUser(id: string) {
        const isDeleted = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!isDeleted.deletedCount;
    }
}