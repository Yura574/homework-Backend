import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

const login1 = 'admin'
const password1 = 'qwerty'
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['authorization']) {
        res.sendStatus(401)
        return
    }

    const auth = req.headers['authorization']
    const token = auth.split(' ')[1]


    try {
        const dataToken: any = jwt.verify(token, "SECRET")
        req.user!.userId = new ObjectId(dataToken.userId)
        next()

    } catch (e) {

        res.sendStatus(401)
    }

    return next()
}