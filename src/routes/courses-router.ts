import express, {Request, Response} from 'express';
import {CourseType, db} from '../db/db';
import {HTTP_STATUSES} from '../utils/httpStatuses';


export const coursesRouter = express.Router()

type RequestTypes<P, B> = Request<P, unknown, B, unknown>
type ParamsType = {
    id: string
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


coursesRouter.get('/all', (req: Request, res: Response) => {
    res.status(200).send(db.courses)
})
coursesRouter.get('/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
    const id = +req.params.id
    const course = db.courses.find(c => c.id === id)
    if (course) {
        res.status(200).send(course)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
coursesRouter.post('/', (req: RequestTypes<ParamsType, BodyCoursePostType>, res: Response) => {

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

coursesRouter.put('/:id', (req: RequestTypes<ParamsType, BodyCoursePutType>, res: Response) => {
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
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    const index = db.courses.findIndex(c => c.id === +req.params.id)

    const newCourse: CourseType = {
        id: db.courses[index].id,
        title,
        studentCount: +studentCount
    }

    db.courses.splice(index, 1, newCourse)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return;
})

coursesRouter.delete('/:id', (req: RequestTypes<ParamsType, any>, res: Response) => {
    const course = db.courses.find(c => c.id === +req.params.id)
    if (!course) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    const index = db.courses.findIndex(u => u.id === +req.params.id)
    db.courses.splice(index, 1)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return;
})
