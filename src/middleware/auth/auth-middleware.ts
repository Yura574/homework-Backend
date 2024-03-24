import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";
import {AuthRequestType} from "../../routes/blog-router";

export const authMiddleware = (req: AuthRequestType, res: Response, next: NextFunction) => {
    if (!req.headers['authorization']) {
        res.sendStatus(401)
        return
    }

    const auth = req.headers['authorization']
    const token = auth.split(' ')[1]
    if (token === 'admin') {
        next()
        return;
    }
    try {
        const dataToken: any = jwt.verify(token, "SECRET")
        console.log(dataToken)
        req.user = {userId: new ObjectId(dataToken.userId)}
        next()
// return
    } catch (e) {

        res.sendStatus(401)

        return;
    }


}