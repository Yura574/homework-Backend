import {UserInputModel} from "../models/userModels";
import {UserRepository} from "../repositories/user-repository";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {newUser} from "../utils/newUser";
import {EmailService} from "./EmailService";
import {v4} from "uuid";
import {validateError} from "../utils/validateError";
import {UserService} from "./UserService";
import {add} from "date-fns";
import {LoginInputModel, LoginResponse, TokenResponseModel} from "../models/authModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class AuthService {

    static async login(data: LoginInputModel): Promise<ObjectResult<TokenResponseModel | null>> {
        const {loginOrEmail, password} = data
        const findUser = await UserRepository.findUser(loginOrEmail)
        if (!findUser) {
            return {status: ResultStatus.Unauthorized, errorsMessages: 'User or password incorrect', data: null}
        }
        if (!findUser.emailConfirmation.isConfirm) {
            return {status: ResultStatus.Forbidden, errorsMessages: 'Confirmed our email', data: null}
        }
        const isCompare = await bcrypt.compare(password, findUser.password)
        if (isCompare) {
            const payload = {userId: findUser._id.toString(),}
            return {
                status: ResultStatus.Success,
                data: {
                    accessToken: {
                        accessToken: jwt.sign(payload, 'ACCESS_SECRET', {expiresIn: '10s'})
                    },
                    refreshToken: {
                        refreshToken: jwt.sign(payload, 'REFRESH_SECRET', {expiresIn: '20s'})
                    }
                }
            }

        }
        return {status: ResultStatus.Unauthorized, errorsMessages: 'User or password incorrect', data: null}

    }

    static async registration(data: UserInputModel): Promise<ObjectResult<string | null>> {
        const {email, login, password} = data
        const error = await UserRepository.uniqueUser(email, login)
        if (error.length > 0) {
            const user = await UserRepository.findUser(email)
            //Пользователь уже зарегестрирован, но не подтвердил почту, высылаем код подтверждения еще раз
            if (user?.emailConfirmation.isConfirm === false && email === email && user?.login === login) {
                const confirmCode = v4()
                const expirationDate = add(new Date(), {
                    hours: 1,
                    minutes: 10
                })
                await UserService.updateUser(email, {
                    expirationDate: expirationDate,
                    confirmationCode: confirmCode
                })
                await EmailService.sendEmail(user.email, confirmCode)

                return {
                    status: ResultStatus.Success,
                    data: 'User registered, confirm code sent to email'
                }
            }
            return {
                status: ResultStatus.BadRequest,
                errorsMessages: validateError(error),
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
        const [confirmCode, email] = code.split('_')
        if (!email || !confirmCode) return {
            status: ResultStatus.BadRequest,
            errorsMessages: validateError([{field: 'code', message: 'Confirm code invalid'}]),
            data: null
        }
        const user = await UserRepository.findUser(email)
        if (!user) return {
            status: ResultStatus.BadRequest,
            errorsMessages: validateError([{field: 'email', message: 'User not found'}]),
            data: null
        }
        if (user?.emailConfirmation.isConfirm) {
            return {
                status: ResultStatus.BadRequest,
                errorsMessages: validateError([{field: 'code', message: 'Code already confirmed'}]),
                data: null
            }
        }

        if (user.emailConfirmation.confirmationCode === confirmCode &&
            user.emailConfirmation.expirationDate > new Date()) {
            //устанавливаем свойсво isConfirm true, и заменяем весь объект в бд
            try {
                await UserService.updateUser(email, {isConfirm: true})
            } catch (e) {
                return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
            }

            return {status: ResultStatus.Success, data: 'Code confirmed successful'}
        }
        return {
            status: ResultStatus.BadRequest,
            errorsMessages: validateError([{field: 'code', message: 'Confirm code invalid'}]),
            data: null
        }
    }

    static async resendingEmail(email: string): Promise<ObjectResult> {
        const user = await UserRepository.findUser(email)
        if (!user) return {
            status: ResultStatus.BadRequest,
            errorsMessages: validateError([{field: 'email', message: 'User with this email not found'}]),
            data: null
        }
        if (user.emailConfirmation.isConfirm === true) {
            return {
                status: ResultStatus.BadRequest,
                errorsMessages: validateError([{field: 'email', message: 'Email already confirmed'}]),
                data: null
            }
        }
        try {
            const confirmationCode = v4()
            const expirationDate = add(new Date(), {hours: 1, minutes: 10})
            await UserService.updateUser(email, {confirmationCode, expirationDate})
            await EmailService.sendEmail(email, confirmationCode)
            return {status: ResultStatus.Success, data: null}
        } catch (err) {
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: "Something was wrong", data: null}
        }

    }
}