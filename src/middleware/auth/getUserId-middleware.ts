import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {RequestType} from "../../routes/blog-router";
import {UserRepository} from "../../repositories/user-repository";


export const getUserId = async (req: RequestType<any, any, any>, res: Response, next: NextFunction)=> {

    const auth = req.headers['authorization'];
    if (!auth) return next()

    const [type, token] = auth.split(' ')
    if (type !== "Basic" && type !== 'Bearer') return next()
    if (type === 'Bearer') {
        try {
            const dataToken: any = jwt.verify(token, process.env.ACCESS_SECRET as string)
            const userData = await UserRepository.getUserById(dataToken.userId)
            if (!userData) return res.sendStatus(401)

            req.user = {
                userId: dataToken.userId,
                login: userData.login
            }
            return next()

        } catch (err) {
            console.warn('auth', err)
            return res.sendStatus(401)

        }

    }
}