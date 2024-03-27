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
import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";
import {RequestType} from "../../routes/blog-router";

const login1 = 'admin'
const password1 = 'qwerty'
export const authMiddleware = (req: RequestType<{}, {}, {}>, res: Response, next: NextFunction) => {
    // if (req.headers['authorization'] !== "Basic YWRtaW46cXdlcnR5") {
    //     res.sendStatus(401)
    //     return
    // }

    // OR
    const auth = req.headers['authorization']

    if (!auth) {
        res.sendStatus(401)
        return
    }
    const [type, token] = auth.split(' ')
    console.log(token)
    if (type !== "Basic" && type !== 'Bearer') {
        res.sendStatus(401)
        return
    }
    if (type === 'Bearer') {
        try {
            const dataToken: any = jwt.verify(token, "SECRET")
            req.user = {
                userId: new ObjectId(dataToken.userId),
                userLogin: dataToken.userLogin
            }
            next()
            return
        } catch (err) {
            console.warn(err)
            res.sendStatus(401)
            return;
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