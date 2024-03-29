import {UserInputModel, UserModel} from "../models/userModels";
import {UserRepository} from "../repositories/user-repository";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {newUser} from "../utils/newUser";
import {EmailService} from "./EmailService";
import {v4} from "uuid";


export class AuthService {
    static async registration(data: UserInputModel): Promise<ObjectResult<string | null>> {
        console.log(123)
        const {email, login, password} = data
        const error = await UserRepository.uniqueUser(email, login)
        console.log(error)
        if (error) {
            const user = await UserRepository.findUser(email)
            //Пользователь уже зарегестрирован, но не подтвердил почту, высылаем код подтверждения еще раз
            if (user?.emailConfirmation.isConfirm === false && email === email && user?.login === login) {
                await EmailService.sendEmail(user.email, user.emailConfirmation.confirmationCode)
                return {
                    status: ResultStatus.Success,
                    data: 'User registered, confirm code sent to email'
                }
            }
            return {
                status: ResultStatus.BadRequest,
                errorsMessages: [error],
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
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        } catch (e) {
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }


    }

    static async confirmEmail(code: string): Promise<ObjectResult<string | null>> {
        console.log(code)
        const [confirmCode, email] = code.split('_')
        console.log(confirmCode)
        console.log(email)
        const user = await UserRepository.findUser(email)
        if (!user) return {status: ResultStatus.BadRequest, errorsMessages: 'User not found', data: null}
        if (user?.emailConfirmation.isConfirm) {
            return {status: ResultStatus.BadRequest, errorsMessages: [{field:'code', message: 'email already confirmed'}], data: null}
        }

        if (user.emailConfirmation.confirmationCode === confirmCode &&
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
                return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
            }

            return {status: ResultStatus.Success, data: 'Code confirmed successful'}
        }
        return {status: ResultStatus.BadRequest, errorsMessages: [{field:'code', message: 'Confirm code invalid'}], data: null}
    }

    static async resendingEmail(email: string): Promise<ObjectResult<null>> {
        const user = await UserRepository.findUser(email)
        if (!user) return {status: ResultStatus.BadRequest, errorsMessages: [{field: 'email', message:'User with this email not found'}], data: null}
        if(user.emailConfirmation.isConfirm === true){
            return {status: ResultStatus.BadRequest, errorsMessages:  [{field: 'email', message:'Email already confirmed'}], data: null}
        }
        const confirmCode = v4()
        await EmailService.sendEmail(email, confirmCode)
        return {status: ResultStatus.Success, data: null}
    }
}