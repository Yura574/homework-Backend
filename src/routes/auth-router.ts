import express, {Response} from "express";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {RequestType, ResponseType} from "./blog-router";
import {AuthRepository} from "../repositories/auth-repository";
import {confirmationCode, loginValidator} from "../validators/authValidators";
import {
    ConfirmEmailQuery,
    LoginInputModel,
    LoginResponse,
    RegistrationConfirmationCodeModel,
    ResendingEmailBody
} from "../models/authModel";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {ValidateError} from "../utils/validateError";
import {UserInputModel} from "../models/userModels";
import {AuthService} from "../service/AuthService";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";
import {emailValidator, userValidation} from "../validators/userValidators";
import {UserRepository} from "../repositories/user-repository";


export const authRouter = express.Router()

authRouter.post('/login', loginValidator(), async (req: RequestType<{}, LoginInputModel, {}>, res: ResponseType<LoginResponse | null>) => {
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const result = await AuthRepository.login(req.body)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    console.log(result)
    return handleErrorObjectResult(result, res)
})

authRouter.post('/registration', userValidation(), async (req: RequestType<{}, UserInputModel, {}>, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) return

    const result: ObjectResult<string | null> = await AuthService.registration(req.body)

    if (result.status === ResultStatus.Created) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})
authRouter.post('/registration-confirmation', confirmationCode, async (req: RequestType<{}, RegistrationConfirmationCodeModel, {}>, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) return

    const result: ObjectResult<string | null> = await AuthService.confirmEmail(req.body.code)

    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})

authRouter.get('/confirm-email', async (req: RequestType<{}, {}, ConfirmEmailQuery>, res: Response) => {

    const {code} = req.query

    const result: ObjectResult<string | null> = await AuthService.confirmEmail( code)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})
authRouter.post('/registration-email-resending', emailValidator, async (req: RequestType<{}, ResendingEmailBody, {}>, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) return

    const {email} = req.body
    const result: ObjectResult<string | null> = await AuthService.resendingEmail(email)
    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})
authRouter.get('/me', authMiddleware, async (req: RequestType<{}, {}, {}>, res: Response) => {
    //userId получаем из accessToken
    if (!req.user?.userId) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)

    const user = await UserRepository.getUserById(req.user.userId)
    const userData = {
        email: user?.email,
        login: user?.login,
        userId: user?._id.toString()
    }
    return res.send(userData)


})