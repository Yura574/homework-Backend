import {UserInputModel, UserModel} from "../models/userModels";
import {UserRepository} from "../repositories/user-repository";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {newUser} from "../utils/newUser";
import {EmailService} from "./EmailService";
import {v4} from "uuid";


export class AuthService {
    static async registration(data: UserInputModel): Promise<ObjectResult<string | null>> {

        const {email, login, password} = data
        const isUserExist = await UserRepository.uniqueUser(email, login)
        if (isUserExist) {
            const user = await UserRepository.findUser(email)
            //Пользователь уже зарегестрирован, но не подтвердил почту, высылаем код подтверждения еще раз
            if (user?.emailConfirmation.isConfirm === false && email === email && user?.login === login) {
                await EmailService.sendEmail(user.email, user.emailConfirmation.confirmationCode)
                return {
                    status: ResultStatus.Success,
                    data: 'User already register, confirm code sent to email'
                }
            }
            return {
                status: ResultStatus.BadRequest,
                errorMessage: isUserExist.errorMessage,
                data: null
            }
        }

        const user = await newUser(email, login, password)

        try {
            const createdUser = await UserRepository.createUser(user)
            if (createdUser) {
                await EmailService.sendEmail(createdUser.email, createdUser.emailConfirmation.confirmationCode)
                return {
                    status: ResultStatus.Created,
                    data: null
                }
            }
            return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
        } catch (e) {
            return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
        }


    }

    static async confirmEmail(email: string, code: string): Promise<ObjectResult<string | null>> {
        const user = await UserRepository.findUser(email)
        if (!user) return {status: ResultStatus.BadRequest, errorMessage: 'User not found', data: null}
        if (user?.emailConfirmation.isConfirm) {
            return {status: ResultStatus.BadRequest, errorMessage: 'email already confirmed', data: null}
        }

        if (user.emailConfirmation.confirmationCode === code &&
            user.emailConfirmation.expirationDate > new Date()) {
            //устанавливаем свойсво isConfirm true, и заменяем весь объект в бд
            const updateUser: UserModel = {
                id: user._id,
                email: user.email,
                login: user.login,
                createdAt: user.createdAt,
                password: user.password,
                emailConfirmation: {
                    confirmationCode: user.emailConfirmation.confirmationCode,
                    isConfirm: true,
                    expirationDate: user.emailConfirmation.expirationDate
                }
            }
            try {
                await UserRepository.updateUser(updateUser)
            } catch (e) {
                return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
            }

            return {status: ResultStatus.Success, data: 'Code confirmed successful'}
        }
        return {status: ResultStatus.BadRequest, errorMessage: 'Confirm code invalid', data: null}
    }

    static async resendingEmail(email: string): Promise<ObjectResult<null>> {
        const user = await UserRepository.findUser(email)
        if (!user) return {status: ResultStatus.BadRequest, errorMessage: 'User with this email not found', data: null}
        if(user.emailConfirmation.isConfirm === true){
            return {status: ResultStatus.BadRequest, errorMessage: 'Email already confirmed', data: null}
        }
        const confirmCode = v4()
        await EmailService.sendEmail(email, confirmCode)
        return {status: ResultStatus.Success, data: null}
    }
}