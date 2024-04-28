import {UserInputModel, UserModel, UserUpdateModel, UserViewModel} from "../models/userModels";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {UserRepository} from "../repositories/user-repository";
import {newUser} from "../utils/newUser";
import {ReturnsUserType} from "../routes/types/usersTypes";
import {validateError} from "../utils/validateError";


export class UserService {
    static async createUser(data: UserInputModel): Promise<ObjectResult<ReturnsUserType | null>> {
        const {email, login, password} = data
        const errors = await UserRepository.uniqueUser(email, login)

        if (errors.length> 0) {
            return {status: ResultStatus.BadRequest, errorsMessages: validateError(errors), data: null}
        }

        const user = await newUser(email, login, password, true)
        try {
            const createdUser = await UserRepository.createUser(user)
            if (!createdUser) {
                return {
                    status: ResultStatus.SomethingWasWrong,
                    errorsMessages: validateError([{field: '', message: 'Something was wrong'}]),
                    data: null
                }
            }
            const returnUser: ReturnsUserType = {
                id: createdUser._id.toString(),
                createdAt: createdUser.createdAt,
                login: createdUser.login,
                email: createdUser.email
            }
            return {status: ResultStatus.Success, data: returnUser}

        } catch (err) {
            console.log(err)
            return {
                status: ResultStatus.SomethingWasWrong,
                errorsMessages: validateError([{field: '', message: 'Something was wrong'}]),
                data: null
            }
        }

    }

    static async getUserById(userId: string): Promise<ObjectResult<UserViewModel | null>>{
        const findUser = await UserRepository.getUserById(userId)
        if(!findUser) return {status: ResultStatus.NotFound, errorsMessages: 'User not found', data: null}
        const user: UserViewModel = {
            id: findUser._id.toString(),
            login: findUser.login,
            email: findUser.email,
            createdAt: findUser.createdAt
        }
        return {status: ResultStatus.Success, data: user}
    }

    static async updateUser(userEmail: string, data: UserUpdateModel): Promise<ObjectResult> {
        const {
            email,
            isConfirm,
            confirmationCode,
            login,
            password,
            expirationDate,
        } = data
        const user = await UserRepository.findUser(userEmail)
        if (!user) return {
            status: ResultStatus.BadRequest,
            errorsMessages: validateError([{field: 'email', message: 'User not found'}]),
            data: null
        }
        const updateUser: UserModel = {
            id: user._id,
            email: email ? email : user.email,
            login: login ? login : user.login,
            createdAt: user.createdAt,
            password: password? password :user.password,
            emailConfirmation: {
                confirmationCode: confirmationCode? confirmationCode :user.emailConfirmation.confirmationCode,
                isConfirm: isConfirm? isConfirm: user.emailConfirmation.isConfirm,
                expirationDate: expirationDate? expirationDate :user.emailConfirmation.expirationDate
            }
        }
        try {
            await UserRepository.updateUser(updateUser)
            return {status: ResultStatus.Success, data: null}
        } catch (e) {
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }
    }
}