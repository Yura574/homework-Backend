import express, {Request, Response} from 'express';
import {blogRoute} from './routes/blog-route';
import {authMiddleware} from './middleware/auth/auth-middleware';
import {blogValidation} from './validators/blog-validators';
import {videoRouter, videos} from './routes/video-router';


export const app = express()
export const port = 5000
app.use(express.json())
app.use('/videos', videoRouter)

app.use('/blogs', authMiddleware, blogValidation(), (req: Request, res: Response) => {

})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0
    res.send(204)
    return
})
//

