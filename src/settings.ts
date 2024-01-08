import express, {Request, Response} from 'express';
import {blogRoute} from './routes/blog-route';
import {authMiddleware} from './middleware/auth/auth-middleware';
import {blogValidation} from './validators/blog-validators';


export const app = express()
export const port = 5000
app.use(express.json())
app.use('/blogs', authMiddleware, blogValidation(), (req: Request, res: Response) => {

})
//
