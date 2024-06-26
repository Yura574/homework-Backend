import express, {Request, Response} from 'express';
import {blogRouter} from './routes/blog-router';
import {postRouter} from './routes/post-router';
import dotenv from 'dotenv';
import {authRouter} from "./routes/auth-router";
import {userRouter} from "./routes/users-router";
import {commentsRouter} from "./routes/comment-router";
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./routes/securityDevices-router";
import cors from 'cors';
import mongoose from "mongoose";

dotenv.config()

export const routerPaths = {
    auth: '/auth',
    users: '/users',
    blogs: '/blogs',
    posts: '/posts',
    comments:'/comments',
    security: '/security',
    deleteAllData: '/testing/all-data'
}
export const app = express()

// app.set('trust proxy', true)
app.set('trust proxy', true)
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}))
export const port = process.env.PORT

app.use(express.json())
app.use(routerPaths.auth, authRouter)
app.use(routerPaths.users, userRouter)
app.use(routerPaths.blogs, blogRouter)
app.use(routerPaths.posts, postRouter)
app.use(routerPaths.comments, commentsRouter)
app.use(routerPaths.security, securityDevicesRouter)


app.delete(routerPaths.deleteAllData, async (req: Request, res: Response) => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
        const collectionName = collection.name;

        // Удалить все документы из коллекции
        await db.collection(collectionName).deleteMany({});

    }
    res.sendStatus(204)
    return
})




