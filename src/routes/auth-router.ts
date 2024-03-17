import express, {Response, Request} from "express";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {validationResult} from "express-validator";
import {RequestType} from "./blog-router";
import {AuthModelType} from "../models/authModel";
import {AuthRepository} from "../repositories/auth-repository";


export const authRouter = express.Router()

authRouter.post('/', async (req: RequestType<{}, AuthModelType, {}>, res: Response) => {
    console.log('auth')
    const isAuth = await AuthRepository.auth(req.body)
    console.log('isAuth', isAuth)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return

})