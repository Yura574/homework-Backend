import {UserInputModel} from "../models/userModels";
import {Response} from 'express'
import {ObjectResult} from "../utils/objectResult";
import {UserRepository} from "../repositories/user-repository";
import {newUser} from "../utils/newUser";
import {ReturnsUserType} from "../routes/types/usersTypes";


export class UserService {
    static async createUser(data: UserInputModel, res: Response) {
        const {email, login, password} = data
        const isUserExist: ObjectResult<boolean> | null = await UserRepository.uniqueUser(email, login)

        if (isUserExist) {
            res.status(isUserExist.status).send(isUserExist.errorMessage)
            return
        }

        const user = await newUser(email, login, password, true)
        try {
            const createdUser = await UserRepository.createUser(user)
            console.log(createdUser)
            if (createdUser) {
                const returnUser: ReturnsUserType = {
                    id: createdUser._id.toString(),
                    createdAt: createdUser.createdAt,
                    login: createdUser.login,
                    email: createdUser.email
                }
                return returnUser
            }
        } catch (err) {
            console.log(err)
        }
        return null

    }

}