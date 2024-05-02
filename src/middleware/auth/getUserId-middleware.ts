import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {RequestType} from "../../routes/blog-router";


export const getUserId = (req: RequestType<any, any, any>, res: Response, next: NextFunction)=> {

    const auth = req.headers['authorization'];
    if (!auth) return next()

    const [type, token] = auth.split(' ')
    if (type !== "Basic" && type !== 'Bearer') return next()
    if (type === 'Bearer') {
        try {
            const dataToken: any = jwt.verify(token, process.env.ACCESS_SECRET as string)
            req.user = {
                userId: dataToken.userId,
            }
            return next()

        } catch (err) {
            console.warn('auth', err)
            return res.sendStatus(401)

        }

    }
}