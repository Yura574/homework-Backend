import express, {Request, Response} from 'express';
import {authMiddleware} from './middleware/auth/auth-middleware';
import {blogValidation} from './validators/blog-validators';
import {videoRouter, videos} from './routes/video-router';
import {db} from './db/db';
import {coursesRouter} from './routes/courses-router';
import {usersRouter} from './routes/users-router';
import {blogRouter} from './routes/blog-router';
import {blogValidators} from './validators/blogValidators';
import {body} from 'express-validator';

export const routerPaths = {
    courses: '/courses',
    videos: '/videos',
    users: '/users',
    blogs: '/blogs',
    deleteVideos: '/testing/all-data',
    deleteAllData: '/delete-all-data'
}
export const app = express()
export const port = 5000
app.use(express.json())
app.use(routerPaths.videos, videoRouter)
app.use(routerPaths.courses, coursesRouter)
app.use(routerPaths.users, usersRouter)
app.use(routerPaths.blogs, authMiddleware, blogValidators(),blogRouter)

// app.use('/blogs', , (req: Request, res: Response) => {
//
// })
app.delete(routerPaths.deleteVideos, (req: Request, res: Response) => {
    videos.length = 0
    res.send(204)
    return
})
app.delete(routerPaths.deleteAllData, (req: Request, res: Response)=> {
    db.courses= []
    db.users = []
    db.studentCourseBindings = []

    res.sendStatus(204).send(204)
})


//

