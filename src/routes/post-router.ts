import express, {Request, Response} from 'express';
import {PostRepository} from '../repositories/post-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogIdValidator, findPost, postValidation} from '../validators/post-validators';
import {ValidateError} from '../utils/validateError';
import {postCollection} from '../db/db';
import {PostItem, ReturnViewModelType} from '../models/blogModels';
import {PostService} from '../domain/PostService';


export const postRouter = express.Router()

type RequestPostType<P, B, Q> = Request<P, {}, B, Q>
type ParamsType = {
    id: string
}
type BodyType = {
    blogId: string
    title: string
    shortDescription: string
    content: string
}
export type QueryType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
}
export type ResponsePostType<R> = Response<R>


postRouter.get('/', async (req: RequestPostType<{}, {}, QueryType>, res: ResponsePostType<ReturnViewModelType<PostItem[]>>) => {
    const posts: ReturnViewModelType<PostItem[]> = await PostService.getPosts(req.query)

    res.send(posts)
})

postRouter.get('/:id', findPost, async (req: Request, res: Response) => {

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

postRouter.post('/', authMiddleware, blogIdValidator, postValidation(), async (req: Request, res: Response) => {

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

postRouter.delete('/:id', authMiddleware, findPost, async (req: Request, res: Response) => {

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
    const isError = ValidateError(req, res)
    //если есть ошибка, validateError возвращает клиенту ошибку
    if (isError) return

    const updatedPost = await PostRepository.updatePost(req.params.id, req.body)
    if (!updatedPost) {
        res.sendStatus(400)
        return;
    }
    res.sendStatus(204)
    return
})