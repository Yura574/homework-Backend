import express, {Request, Response} from 'express';
import {PostRepository} from '../repositories/post-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogIdValidator, findPost, postValidation} from '../validators/post-validators';
import {ValidateError} from '../utils/validateError';
import {postCollection} from '../db/db';


export const postRouter = express.Router()

postRouter.get('/', async (req: Request, res: Response) => {
    const allPosts = await PostRepository.getAllPost()
    const returnAllPosts = allPosts.map(post => {
        return {
            id: post?._id,
            blogId: post?.blogId,
            title: post?.title,
            shortDescription: post?.shortDescription,
            content: post?.content,
            createdAt: post?.createdAt,
            blogName: post?.blogName
        }
    })

    res.send(returnAllPosts)
})

postRouter.get('/:id', findPost, async (req: Request, res: Response) => {
    // const result = validationResult(req)
    // const errors = ValidateError(result)
    // if (errors) {
    //     if (errors.errorsMessages[0].field === 'id') {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return;
    //     }
    // }
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const id = req.params.id
    const post = await PostRepository.getPostById(id)
    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    res.send(post)
})

postRouter.post('/', authMiddleware, postValidation(), async (req: Request, res: Response) => {

    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const data = req.body
    const newPost = await PostRepository.createPost(data)
    if (newPost) {
        const createdPost = await postCollection.insertOne(newPost)
        const post = await postCollection.findOne({_id: createdPost.insertedId})
        const returnPost = {
            id: post?._id,
            blogId: post?.blogId,
            title: post?.title,
            blogName: post?.blogName,
            content: post?.content,
            shortDescription: post?.shortDescription,
            createdAt: post?.createdAt
        }
        res.status(HTTP_STATUSES.CREATED_201).send(returnPost)
        return
    }
    res.status(HTTP_STATUSES.NOT_FOUND_404).send('blog not found')
    return;

})

postRouter.delete('/:id', authMiddleware, findPost, blogIdValidator, async (req: Request, res: Response) => {
    // const result = validationResult(req)
    // const errors = ValidateError(result)
    // if (errors) {
    //     if (errors.errorsMessages[0].field === 'id') {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return;
    //     }
    // }
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }

    const id = req.params.id
    const isDeleted = await PostRepository.deletePost(id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return;
})

postRouter.put('/:id', authMiddleware, findPost, blogIdValidator, postValidation(), async (req: Request, res: Response) => {
    // const result = validationResult(req)
    // const errors = ValidateError(result)
    // if (errors) {
    //     if (errors.errorsMessages[0].field === 'id') {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return;
    //     }
    //     res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    //     return;
    // }
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }

    const updatedPost = await PostRepository.updatePost(req.params.id, req.body)
    if (!updatedPost) {
        res.sendStatus(400)
        return;
    }
    res.sendStatus(204)
    return
})