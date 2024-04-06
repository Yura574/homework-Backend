import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {RequestType, ResponseType} from "./blog-router";
import {confirmationCode, loginValidator} from "../validators/authValidators";
import {
    ConfirmEmailQuery,
    LoginInputModel,
        RegistrationConfirmationCodeModel,
    ResendingEmailBody
} from "../models/authModel";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {ValidateErrorRequest} from "../utils/validateErrorRequest";
import {UserInputModel, UserMeModel} from "../models/userModels";
import {AuthService} from "../service/AuthService";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";
import {emailValidator, userValidation} from "../validators/userValidators";
import {UserRepository} from "../repositories/user-repository";
import jwt from "jsonwebtoken";
import {UserService} from "../service/UserService";


export const authRouter = express.Router()

//Исправить ResponseType
authRouter.post('/login', loginValidator(), async (req: RequestType<{}, LoginInputModel, {}>, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
    if (isError) {
        return
    }

    const ip = req.ip
    const deviceName = req.headers["user-agent"]
    //если пользователь зологинен, выдаем ошибку
    if(req.cookies.refreshToken){
        try{
            const tokenData: any = jwt.verify(req.cookies.refreshToken.refreshToken, process.env.REFRESH_SECRET as string)
            console.log(tokenData)
            const {data} = await UserService.getUserById(tokenData.userId)
            console.log(data)
        } catch (e) {

        }


    }

    const result = await AuthService.login({...req.body, deviceName, ip})
    if (result.status === ResultStatus.Success) {
        return res.cookie('refreshToken', result.data?.refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUSES.OK_200)
            .send(result.data?.accessToken)
    }

    return handleErrorObjectResult(result, res)
})

authRouter.post('/registration', userValidation(), async (req: RequestType<{}, UserInputModel, {}>, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
    if (isError) return

    const result: ObjectResult<string | null> = await AuthService.registration(req.body)

    if (result.status === ResultStatus.Created) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})
authRouter.post('/registration-confirmation', confirmationCode, async (req: RequestType<{}, RegistrationConfirmationCodeModel, {}>, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
    if (isError) return

    const result: ObjectResult<string | null> = await AuthService.confirmEmail(req.body.code)

    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})

authRouter.get('/confirm-email', async (req: RequestType<{}, {}, ConfirmEmailQuery>, res: Response) => {

    const {code} = req.query

    const result: ObjectResult<string | null> = await AuthService.confirmEmail(code)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})
authRouter.post('/registration-email-resending', emailValidator, async (req: RequestType<{}, ResendingEmailBody, {}>, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
    if (isError) return

    const {email} = req.body
    const result: ObjectResult<string | null> = await AuthService.resendingEmail(email)
    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})
authRouter.get('/me', authMiddleware, async (req: RequestType<{}, {}, {}>, res: ResponseType<UserMeModel>) => {
    //userId получаем из accessToken
    console.log('me')
    if (!req.user?.userId) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)


    const user = await UserRepository.getUserById(req.user.userId.toString())
    if(!user) return {status: ResultStatus.NotFound, errorMessage: 'User not found', data: null}
    const userData: UserMeModel = {
        email: user.email,
        login: user.login,
        userId: user._id.toString()
    }
    return res.send(userData)


})

authRouter.post('/refresh-token',  async (req: Request, res: any)=> {
    const refreshToken = req.cookies.refreshToken.refreshToken
    console.log(refreshToken)
    if(!refreshToken) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)
    const result = await AuthService.refreshToken(refreshToken)
    console.log(result)
   if(result.status === ResultStatus.Success) return res.cookie('refreshToken', result.data?.refreshToken, {httpOnly: true, secure: true})
       .status(HTTP_STATUSES.OK_200)
       .send(result.data?.accessToken)
    return  handleErrorObjectResult(result, res)
})

authRouter.post('/logout',  async (req: Request, res: Response)=> {
    const refreshToken = req.cookies.refreshToken
    console.log(req.cookies)
    if(!refreshToken) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)

    const result = await AuthService.deleteToken(refreshToken)
    console.log(result)
    if(result.status === ResultStatus.Success) return res.clearCookie('refreshToken')
        .sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    return  handleErrorObjectResult(result, res)
})
