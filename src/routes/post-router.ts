import express, {Request, Response} from 'express';
import {PostRepository} from '../repositories/post-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {db} from '../db/db';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {findPost, postValidation} from '../validators/post-validators';
import {validationResult} from 'express-validator';
import {ValidateError} from '../utils/validateError';


export const postRouter = express.Router()

postRouter.get('/', async (req: Request, res: Response) => {
    const allPosts = PostRepository.getAllPost()

    res.send(allPosts)
})

postRouter.get('/:id', findPost, (req: Request, res: Response) => {
    const result = validationResult(req)
    const errors = ValidateError(result)
    if (errors) {
        if (errors.errorsMessages[0].field === 'id') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
    }
    const id = req.params.id
    const post = PostRepository.getPostById(id)
    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    res.send(post)
})

postRouter.post('/', authMiddleware, postValidation(), (req: Request, res: Response) => {

    const result = validationResult(req)
    if (!result.isEmpty()) {

        const errors = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        console.log(errors)
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return;
    }
    const data = req.body
    const newPost = PostRepository.createPost(data)
    if (newPost) {
        db.posts.push(newPost)
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
        return
    }
    res.status(HTTP_STATUSES.NOT_FOUND_404).send('blog not found')
    return;

})

postRouter.delete('/:id', authMiddleware, findPost, (req: Request, res: Response) => {
    const result = validationResult(req)
    const errors = ValidateError(result)
    if (errors) {
        if (errors.errorsMessages[0].field === 'id') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
    }

    const id = req.params.id
    const isDeleted = PostRepository.deletePost(id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return;
})

postRouter.put('/:id', authMiddleware, findPost, postValidation(), (req: Request, res: Response) => {
    const result = validationResult(req)
    const errors = ValidateError(result)
    if (errors) {
        if (errors.errorsMessages[0].field === 'id') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return;
    }

    const updatedPost = PostRepository.updatePost(req.params.id, req.body)
    if (!updatedPost) {
        res.sendStatus(400)
        return;
    }
    res.sendStatus(204)
    return
})