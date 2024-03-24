import {UserInputModel, UserModel} from "../models/userModels";
import {UserRepository} from "../repositories/user-repository";
import {ObjectResult} from "../utils/objectResult";
import {newUser} from "../utils/newUser";
import {EmailService} from "./EmailService";
import {HTTP_STATUSES} from "../utils/httpStatuses";


export class AuthService {
    static async registration(data: UserInputModel) {

        const {email, login, password} = data
        const isUserExist: ObjectResult<boolean> | null = await UserRepository.uniqueUser(email, login)
        if (isUserExist) {
            return isUserExist
        }

        const user = await newUser(email, login, password)

        try {
            const createdUser = await UserRepository.createUser(user)
            console.log(createdUser)
            if (createdUser) {
                await EmailService.sendEmail(createdUser.email, createdUser.emailConfirmation.confirmationCode)
            }
        } catch (err) {
            console.log(err)

        }

        return
    }

    static async confirmEmail(email: string, code: string) {
        const user = await UserRepository.findUser(email)
        if(user?.ememailConfirmation.isConfirm){
            return {status: HTTP_STATUSES.BAD_REQUEST_400, errorMessage: 'email already confirmed'} as ObjectResult<{}>
        }

        if (user) {
                if (user.emailConfirmation.confirmationCode === code &&
                    user.emailConfirmation.expirationDate > new Date()) {
                    const updateUser: UserModel = {
                        id: user._id,
                        email: user.email,
                        login: user.login,
                        createdAt: user.createdAt,
                        password: user.password,
                        emailConfirmation: {
                            confirmationCode: user.ememailConfirmation.confirmationCode,
                            isConfirm: true,
                            expirationDate: user.ememailConfirmation.expirationDate
                        }
                    }

                    await UserRepository.updateUser(updateUser)
                    return {status: HTTP_STATUSES.OK_200, data: 'code confirmed successful'} as ObjectResult<string>
                }
            return {status: HTTP_STATUSES.BAD_REQUEST_400, errorMessage: 'confirmation code invalid'}as ObjectResult<{}>
        }
        return {status: HTTP_STATUSES.NOT_FOUND_404, errorMessage: 'user not found'} as ObjectResult<{}>
    }
}