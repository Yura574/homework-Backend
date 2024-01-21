import express, {Request, Response} from 'express';
import {videoRouter, videos} from './routes/video-router';
import {db} from './db/db';
import {coursesRouter} from './routes/courses-router';
import {usersRouter} from './routes/users-router';
import {blogRouter} from './routes/blog-router';
import {postRouter} from './routes/post-router';
export const routerPaths = {
    courses: '/courses',
    videos: '/videos',
    users: '/users',
    blogs: '/blogs',
    posts: '/posts',
    deleteVideos: '/delete-all-data',
    deleteAllData: '/testing/all-data'
}
export const app =  express()
export const port = 5000
app.use(express.json())
app.use(routerPaths.videos, videoRouter)
app.use(routerPaths.courses, coursesRouter)
app.use(routerPaths.users, usersRouter)
app.use(routerPaths.blogs,blogRouter)
app.use(routerPaths.posts,postRouter)

// app.use('/blogs', , (req: Request, res: Response) => {
//
// })
app.delete(routerPaths.deleteVideos, (req: Request, res: Response) => {
    videos.length = 0
    res.sendStatus(204)
    return
})
app.delete(routerPaths.deleteAllData, (req: Request, res: Response)=> {
    db.courses.length = 0
    db.users.length = 0
    db.studentCourseBindings.length = 0
    db.blogs.length = 0
    db.posts.length = 0

    res.sendStatus(204)
    return
})




