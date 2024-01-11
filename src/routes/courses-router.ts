import express, {Request, Response} from 'express';
import {CourseType, db, UserType} from '../db/db';


export const coursesRouter = express.Router()

type RequestTypes<P, B> = Request<P, unknown, B, unknown>
type ParamsType = {
    id: string
}
type BodyUserType = {
    userName: string
}
type BodyCoursePostType = {
    title: string
}
type BodyCoursePutType = {
    title: string,
    studentCount: number
}
type ErrorsType = {
    messageError: MessageErrorType[]
}
type MessageErrorType = {
    field: string
    message: string
}


coursesRouter.get('/all-courses', (req: Request, res: Response) => {
    res.status(200).send(db.courses)
})
coursesRouter.get('/courses/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
    const id = +req.params.id
    const course = db.courses.find(c => c.id === id)
    if (course) {
        res.status(200).send(course)
        return
    }
    res.send(404)
})
coursesRouter.post('/courses', (req: RequestTypes<ParamsType, BodyCoursePostType>, res: Response) => {

    const {title} = req.body
    const errors: ErrorsType = {
        messageError: []
    }
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 20) {
        errors.messageError.push({field: 'Course', message: 'Course title incorrect'})
    }

    if (errors.messageError.length > 0) {
        res.status(400).send(errors.messageError)
        return
    }

    const newCourse: CourseType = {
        id: +(new Date()),
        title,
        studentCount: 10
    }
    db.courses.push(newCourse)
    res.status(201).send(newCourse)
    return;


})

coursesRouter.put('/courses/:id', (req: RequestTypes<ParamsType, BodyCoursePutType>, res: Response) => {
    const id = +req.params.id
    const {title, studentCount} = req.body
    const errors: ErrorsType = {
        messageError: []
    }
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 20) {
        errors.messageError.push({field: 'Course', message: 'Course title incorrect'})
    }

    if (!studentCount || typeof  +studentCount === 'string'||  isNaN(+studentCount) || typeof +studentCount !== 'number') {
        errors.messageError.push({field: 'Student count', message: 'Student count incorrect'})
    }
    if (errors.messageError.length > 0) {
        res.status(400).send(errors.messageError)
        return
    }

    const course = db.courses.find(c => c.id === id)
    if (!course) {
        res.send(404)
        return;
    }
    const index = db.courses.findIndex(c => c.id === +req.params.id)

    const newCourse: CourseType = {
        id: db.courses[index].id,
        title,
        studentCount: +studentCount
    }

    db.courses.splice(index, 1, newCourse)
    res.send(204)
    return;
})

coursesRouter.delete('/courses/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
    const course = db.courses.find(c => c.id === +req.params.id)
    if (!course) {
        res.send(404)
        return
    }
    const index = db.courses.findIndex(u => u.id === +req.params.id)
    db.courses.splice(index, 1)
    res.send(204)
    return;
})
coursesRouter.get('/all-users', (req: Request, res: Response) => {
    res.status(200).send(db.users)
})
coursesRouter.get('/users/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
    const id = +req.params.id
    const user = db.users.find(c => c.id === id)
    if (user) {
        res.status(200).send(user)
        return
    }
    res.send(404)
})

coursesRouter.post('/users', (req: RequestTypes<ParamsType, BodyUserType>, res: Response) => {

    const {userName} = req.body
    const errors: ErrorsType = {
        messageError: []
    }
    if (!userName || !userName.trim() || typeof userName !== 'string' || userName.length > 20) {
        errors.messageError.push({field: 'User', message: 'User title incorrect'})
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
    res.status(200).send(newUser)
    return;

})
coursesRouter.put('/users/:id', (req: RequestTypes<ParamsType, BodyUserType>, res: Response) => {
    const id = +req.params.id
    const {userName} = req.body
    const errors: ErrorsType = {
        messageError: []
    }
    if (!userName || !userName.trim() || typeof userName !== 'string' || userName.length > 20) {
        errors.messageError.push({field: 'Course', message: 'Course title incorrect'})
    }

    if (errors.messageError.length > 0) {
        res.status(400).send(errors.messageError)
        return
    }

    const user = db.users.find(u => u.id === id)
    if (!user) {
        res.send(404)
        return;
    }
    const index = db.courses.findIndex(c => c.id === +req.params.id)

    const newUser: UserType = {
        id: db.courses[index].id,
        userName,
    }
    db.users.splice(index, 1, newUser)
    res.send(204)
    return;
})

coursesRouter.delete('users/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
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
