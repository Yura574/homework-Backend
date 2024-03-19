import express, {Response} from "express";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {RequestType} from "./blog-router";
import {AuthModelType} from "../models/authModel";
import {AuthRepository} from "../repositories/auth-repository";
import {authValidator} from "../validators/authValidators";


export const authRouter = express.Router()

authRouter.post('/login', authValidator(),async (req: RequestType<{}, AuthModelType, {}>, res: Response) => {
    console.log('auth')
    const isAuth = await AuthRepository.auth(req.body)
    if(isAuth){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)

    return

})