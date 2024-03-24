import express, {Response, Request} from "express";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {AuthRequestType, RequestType} from "./blog-router";
import {AuthRepository} from "../repositories/auth-repository";
import {authValidator} from "../validators/authValidators";
import {ConfirmEmailQuery, LoginInputModel} from "../models/authModel";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {ValidateError} from "../utils/validateError";
import {UserRepository} from "../repositories/user-repository";
import {UserInputModel} from "../models/userModels";
import {AuthService} from "../service/AuthService";


export const authRouter = express.Router()

authRouter.post('/login', authValidator(),async (req: RequestType<{}, LoginInputModel, {}>, res: Response) => {
    const isError =  ValidateError(req, res)
    if(isError){
        return
    }
    const token = await AuthRepository.login(req.body)
    if(token){
        res.status(HTTP_STATUSES.OK_200).send({accessToken:token})
        return
    }
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    return

})

authRouter.post('/registration', async (req: RequestType<{}, UserInputModel, {}>, res: Response)=> {
    await AuthService.registration(req.body)
    res.send('reg')
})

authRouter.get('/confirm-email', async (req: RequestType<{}, {}, ConfirmEmailQuery>, res: Response)=> {
    const {code, email} = req.query
    console.log(code, email)
    const  {status, errorMessage,data} = await AuthService.confirmEmail(email, code)
    res.status(status).send(errorMessage? errorMessage : data)
})
authRouter.get('/me', authMiddleware,async (req: AuthRequestType, res: Response)=> {

    // if(req.user?.userId){
    //     const user = await UserRepository.getUserById(req.user.userId)
    //     const userData={
    //         email: user?.email,
    //         login: user?.login,
    //         userId: user?._id.toString()
    //     }
    //     res.send(userData)
    //     return
    // }
    // // const userData = await UserRepository.getUserById(req.user!.userId)
    // // res.sendStatus(HTTP_STATUSES.OK_200)
    // return

    res.send('sd')
})