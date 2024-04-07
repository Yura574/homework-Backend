import {UserInputModel} from "../models/userModels";
import {UserRepository} from "../repositories/user-repository";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {newUser} from "../utils/newUser";
import {EmailService} from "./EmailService";
import {v4} from "uuid";
import {validateError} from "../utils/validateError";
import {UserService} from "./UserService";
import {add} from "date-fns";
import {LoginInputModel, TokenResponseModel} from "../models/authModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {BlacklistRepository} from "../repositories/blacklist-repository";
import {SecurityDevicesService} from "./SecurityDevicesService";
import {somethingWasWrong} from "../utils/somethingWasWrong";


export class AuthService {

    static async login(data: LoginInputModel): Promise<ObjectResult<TokenResponseModel | null>> {
        const {loginOrEmail, password, deviceName, ip} = data
        const findUser = await UserRepository.findUser(loginOrEmail)
        if (!findUser) {
            return {status: ResultStatus.Unauthorized, errorsMessages: 'User or password incorrect', data: null}
        }

        if (!findUser.emailConfirmation.isConfirm) {
            return {status: ResultStatus.Forbidden, errorsMessages: 'Confirmed our email', data: null}
        }
        const isCompare = await bcrypt.compare(password, findUser.password)
        if (isCompare) {
            const accessPayload = {userId: findUser._id.toString()}
            const refreshPayload = {
                userId: findUser._id.toString(),
                deviceId: v4()
            }

            const accessToken = {
                accessToken: jwt.sign(accessPayload, process.env.ACCESS_SECRET as string, {expiresIn: '1h'})
            }
            const refreshToken = {
                refreshToken: jwt.sign(refreshPayload, process.env.REFRESH_SECRET as string, {expiresIn: '2h'})
            }

//добавляем для пользователя новое устройство
            try {
                //дату создания и id получаем из только что созданного токена
                const {iat, deviceId}: any = jwt.verify(refreshToken.refreshToken, process.env.REFRESH_SECRET as string)
                const result = await SecurityDevicesService.addDevice({
                    userId: findUser._id.toString(),
                    issuedAt: iat,
                    deviceId,
                    deviceName,
                    ip
                })
                if (result.status !== ResultStatus.Success) return somethingWasWrong
            } catch (err) {
                return somethingWasWrong
            }
            return {
                status: ResultStatus.Success,
                data: {accessToken, refreshToken}
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

// Исправить return Promise
    static async refreshToken(refreshToken: string) {
        try {
            const dataToken: any = jwt.verify(refreshToken, "REFRESH_SECRET")
            const findUser = await UserRepository.getUserById(dataToken.userId)
            if (!findUser) {
                return {status: ResultStatus.Unauthorized, errorsMessages: 'User not found', data: null}
            }
            const blacklistToken = await BlacklistRepository.findToken(refreshToken)
            if (blacklistToken) return {status: ResultStatus.Unauthorized, errorsMessages: 'Unauthorized', data: null}
            await BlacklistRepository.addToken(refreshToken)
            setTimeout(async () => {
                await BlacklistRepository.deleteToken(refreshToken)
            }, 20000)
            const accessPayload = {userId: findUser._id.toString(),}
            const refreshPayload = {userId: findUser._id.toString(), deviceId: dataToken.deviceId}
            const tokens = {
                accessToken: {
                    accessToken: jwt.sign(accessPayload, 'ACCESS_SECRET', {expiresIn: '1h'})
                },
                refreshToken: {
                    refreshToken: jwt.sign(refreshPayload, 'REFRESH_SECRET', {expiresIn: '2h'})
                }
            }
            const newDataToken: any  =jwt.verify(tokens.refreshToken.refreshToken, process.env.REFRESH_SECRET as string)
            await SecurityDevicesService.updateDevice(newDataToken.deviceId, newDataToken.iat)

            return {status: ResultStatus.Success, data: tokens}
        } catch (err) {
            console.log(err)
            // console.log(err.expiredAt)
            return {status: ResultStatus.Unauthorized, errorsMessages: 'Unauthorized', data: null}
        }
    }

    static async deleteToken(refreshToken: string): Promise<ObjectResult> {
        try {
            const dataToken: any = jwt.verify(refreshToken, "REFRESH_SECRET")
            const findUser = await UserRepository.getUserById(dataToken.userId)
            if (!findUser) {
                return {status: ResultStatus.Unauthorized, errorsMessages: 'User not found', data: null}
            }
            const token = await BlacklistRepository.findToken(refreshToken)
            if (token) return {status: ResultStatus.Unauthorized, errorsMessages: 'Unauthorized', data: null}
            console.log(new Date(dataToken.exp))
            await BlacklistRepository.addToken(refreshToken)
            setTimeout(async () => {
                await BlacklistRepository.deleteToken(refreshToken)
            }, 20000)
            return {status: ResultStatus.Success, data: null}
        } catch (err) {
            // console.log(err.expiredAt)
            return {status: ResultStatus.Unauthorized, errorsMessages: 'Unauthorized', data: null}
        }
    }
}