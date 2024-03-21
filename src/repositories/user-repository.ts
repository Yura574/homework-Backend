import {GetUsersQuery} from "../models/userModels";
import {userCollection} from "../db/db";
import {CreateUserBodyType, NewUserType} from "../routes/types/usersTypes";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken'

export class UserRepository {
    static async foundUser(loginOrEmail: string) {
        const userLogin = await userCollection.findOne({
            $or: [
                {login: {$regex: loginOrEmail}},
                {email: {$regex: loginOrEmail}}
            ]
        })
        if (userLogin) {
            return userLogin
        }
        return false
    }

    static async getAllUsers(data: GetUsersQuery) {

        const {
            pageSize = 10,
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


    static async createUser(body: CreateUserBodyType) {
        const {login, email, password} = body

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser: NewUserType = {
            email,
            login,
            password: hashPassword,
            createdAt: new Date().toISOString()
        }

        const createdUser = await userCollection.insertOne(newUser)
        return await userCollection.findOne({_id: createdUser.insertedId})

    }

    static async deleteUser(id: string) {
        const isDeleted = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!isDeleted.deletedCount;
    }
}