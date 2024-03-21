import express, {Request, Response} from 'express';
import {blogRouter} from './routes/blog-router';
import {postRouter} from './routes/post-router';
import dotenv from 'dotenv';
import {database} from './db/db';
import {authRouter} from "./routes/auth-router";
import {userRouter} from "./routes/users-router";

dotenv.config()

const a = 2
export const routerPaths = {
    auth: '/auth',
    users: '/users',
    blogs: '/blogs',
    posts: '/posts',
    comments:'/comments',
    deleteAllData: '/testing/all-data'
}
export const app = express()
export const port = process.env.PORT

app.use(express.json())
app.use(routerPaths.auth, authRouter)
app.use(routerPaths.users, userRouter)
app.use(routerPaths.blogs, blogRouter)
app.use(routerPaths.posts, postRouter)


app.delete(routerPaths.deleteAllData, async (req: Request, res: Response) => {
    const collections = await database.listCollections().toArray();

    for (const collection of collections) {
        const collectionName = collection.name;

        // Удалить все документы из коллекции
        await database.collection(collectionName).deleteMany({});

    }
    res.sendStatus(204)
    return
})




