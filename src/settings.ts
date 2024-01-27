
import express, {Request, Response} from 'express';
import {blogRouter} from './routes/blog-router';
import {postRouter} from './routes/post-router';
import dotenv from 'dotenv';
import {blogCollection} from './index';

dotenv.config()


export const routerPaths = {
    blogs: '/blogs',
    posts: '/posts',
    deleteAllData: '/testing/all-data'
}
export const app =  express()
export const port = process.env.PORT

app.use(express.json())
app.use(routerPaths.blogs,blogRouter)
app.use(routerPaths.posts,postRouter)


app.delete(routerPaths.deleteAllData, async (req: Request, res: Response)=> {
  await blogCollection.drop()

    res.sendStatus(204)
    return
})




