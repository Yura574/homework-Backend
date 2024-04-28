// import {NextFunction, Request, Response} from 'express';
// import jwt from "jsonwebtoken";
// import {ObjectId} from "mongodb";
// import {AuthRequestType} from "../../routes/blog-router";
//
// export const authMiddleware = (req: AuthRequestType, res: Response, next: NextFunction) => {
//     if (!req.headers['authorization']) {
//         res.sendStatus(401)
//         return
//     }
//
//     const auth = req.headers['authorization']
//     const token = auth.split(' ')[1]
//     if (token === 'admin') {
//         next()
//         return;
//     }
//     try {
//         const dataToken: any = jwt.verify(token, "SECRET")
//         console.log(dataToken)
//         req.user = {userId: new ObjectId(dataToken.userId)}
//         next()
// // return
//     } catch (e) {
//
//         res.sendStatus(401)
//
//         return;
//     }
//
//
// }
import {NextFunction,  Response} from 'express';
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";
import {RequestType} from "../../routes/blog-router";



const login1 = 'admin'
const password1 = 'qwerty'
export const authMiddleware = (req: RequestType<{}, {}, {}>, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization']


    if (!auth) return res.sendStatus(401)

    const [type, token] = auth.split(' ')
    if (type !== "Basic" && type !== 'Bearer') return res.sendStatus(401)
    if (type === 'Bearer') {
        try {
            const dataToken: any = jwt.verify(token, process.env.ACCESS_SECRET as string)
            req.user = {
                userId: new ObjectId(dataToken.userId),
            }
            return next()

        } catch (err) {
            console.warn('auth', err)
            return res.sendStatus(401)

        }

    }


    const decodedToken = Buffer.from(token, 'base64').toString()
    const [login, password] = decodedToken.split(':')
    if (login !== login1 || password !== password1) {
        res.sendStatus(401)
        return;
    }
    return next()
}