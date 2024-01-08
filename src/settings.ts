import express, {Request, Response} from 'express';
import {blogRoute} from './routes/blog-route';
import {authMiddleware} from './middleware/auth/auth-middleware';
import {blogValidation} from './validators/blog-validators';
import {videoRouter} from './routes/video-router';


export const app = express()
export const port = 5000
app.use(express.json())
app.use('/hometask_01/api/videos', videoRouter)
app.use('/blogs', authMiddleware, blogValidation(), (req: Request, res: Response) => {

})
//

