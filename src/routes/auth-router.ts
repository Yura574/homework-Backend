import express, {Response, Request} from "express";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {RequestType} from "./blog-router";
import {AuthRepository} from "../repositories/auth-repository";
import {authValidator} from "../validators/authValidators";
import {LoginInputModel} from "../models/authModel";
import {authMiddleware} from "../middleware/auth/auth-middleware";


export const authRouter = express.Router()

authRouter.post('/login', authValidator(),async (req: RequestType<{}, LoginInputModel, {}>, res: Response) => {
    const token = await AuthRepository.login(req.body)
    if(token){
        res.status(HTTP_STATUSES.OK_200).send({accessToken:token})
        return
    }
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    return

})

authRouter.get('/me', authMiddleware,async (req: Request, res: Response)=> {
    console.log(req.user)
    res.send(true)
})