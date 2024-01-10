import express, {Request, Response} from 'express';
import {blogRoute} from './routes/blog-route';
import {authMiddleware} from './middleware/auth/auth-middleware';
import {blogValidation} from './validators/blog-validators';
import {videoRouter, videos} from './routes/video-router';
import {db} from './db/db';
import {coursesRouter} from './routes/courses-router';


export const app = express()
export const port = 5000
app.use(express.json())
app.use('/videos', videoRouter)
app.use('/course', coursesRouter)

app.use('/blogs', authMiddleware, blogValidation(), (req: Request, res: Response) => {

})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0
    res.send(204)
    return
})
app.delete('/delete-all-data', (req: Request, res: Response)=> {
    db.courses= []
    db.users = []
    db.studentCourseBindings = []

    res.sendStatus(204).send(204)
})
//

