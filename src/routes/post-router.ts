import express, {Request, Response} from 'express';
import {PostRepository} from '../repositories/post-repository';
import {BlogRepository} from '../repositories/blog-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {db} from '../db/db';


export const postRouter = express.Router()

postRouter.get('/', async (req: Request, res: Response) => {
    const allPosts = PostRepository.getAllPost()

    res.send(allPosts)
})

postRouter.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const post = PostRepository.getPostById(id)
    console.log(post)
    if (!post) {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.send(post)
})

postRouter.post('/', (req: Request, res: Response) => {
    const data = req.body
    const newPost = PostRepository.createPost(data)
    console.log(newPost)
    if (newPost) {
        db.posts.push(newPost)
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
        return
    }
    res.status(HTTP_STATUSES.BAD_REQUEST_400).send('blog not found')
    return;

})

postRouter.delete('/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const isDeleted = PostRepository.deletePost(id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return;
})

postRouter.put('/:id', (req: Request, res: Response)=> {
    const updatedPost = PostRepository.updatePost(req.params.id, req.body)
    if(!updatedPost){
        res.send(400)
    }
    res.send(204)
})