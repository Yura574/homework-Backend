import express, {Request, Response} from 'express';
import {CourseType, db, UserType} from '../db/db';
import {HTTP_STATUSES} from '../utils/httpStatuses';


export const usersRouter = express.Router()

type RequestTypes<P, B> = Request<P, unknown, B, unknown>
type ParamsType = {
    id: string
}
type BodyUserType = {
    userName: string
}
type ErrorsType = {
    messageError: MessageErrorType[]
}
type MessageErrorType = {
    field: string
    message: string
}



usersRouter.get('/all', (req: Request, res: Response) => {
    res.status(200).send(db.users)
})
usersRouter.get('/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
    const id = +req.params.id
    const user = db.users.find(c => c.id === id)
    if (user) {
        res.status(200).send(user)
        return
    }
    res.send(404)
})

usersRouter.post('/', (req: RequestTypes<ParamsType, BodyUserType>, res: Response) => {


    const {userName} = req.body
    const errors: ErrorsType = {
        messageError: []
    }
    if (!userName || typeof userName !== 'string' || !userName.trim() || userName.length > 20) {
        errors.messageError.push({field: 'User', message: 'User name incorrect'})
    }

    if (errors.messageError.length > 0) {
        res.status(400).send(errors.messageError)
        return
    }

    const newUser: UserType = {
        id: +(new Date()),
        userName
    }
    db.users.push(newUser)
    res.status(201).send(newUser)
    return;

})

usersRouter.put('/:id', (req: RequestTypes<ParamsType, BodyUserType>, res: Response) => {
    const id = +req.params.id
    const {userName} = req.body
    const errors: ErrorsType = {
        messageError: []
    }
    if (!userName || typeof userName !== 'string' || !userName.trim() || userName.length > 20) {
        errors.messageError.push({field: 'User', message: 'User name incorrect'})
    }

    if (errors.messageError.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors.messageError)
        return
    }
    const user = db.users.find(u => u.id === id)
    if (!user) {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    const index = db.users.findIndex(c => c.id === id)
    const newUser: UserType = {
        id: db.users[index].id,
        userName,
    }
    db.users.splice(index, 1, newUser)
    res.send(HTTP_STATUSES.NO_CONTENT_204)
    return;
})

usersRouter.delete('/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
    const user = db.users.find(u => u.id === +req.params.id)
    if (!user) {
        res.send(404)
        return
    }
    const index = db.users.findIndex(u => u.id === +req.params.id)
    db.users.splice(index, 1)
    res.send(204)
    return;
})
