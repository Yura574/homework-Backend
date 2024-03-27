import {PostRepository} from '../repositories/post-repository';
import {QueryType} from '../routes/post-router';
import {NewPostModel, PostInputModel, PostViewModel} from "../models/postModels";
import {ReturnViewModel} from "../models/commonModels";
import {blogCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {CommentViewModel} from "../models/commentModel";
import {CommentService} from "./CommentService";


export class PostService {
    static async getPosts(dataQuery: QueryType): Promise<ObjectResult<ReturnViewModel<PostViewModel[]>>> {
        const {pageSize = 10, pageNumber = 1, sortBy = 'createdAt', sortDirection = 'desc'} = dataQuery

        const {posts, totalCount} = await PostRepository.getPosts(+pageSize, +pageNumber, sortBy, sortDirection)

        const editedPost: PostViewModel[] = posts.map(post => {
            return {
                id: post?._id.toString(),
                blogId: post?.blogId,
                title: post?.title,
                shortDescription: post?.shortDescription,
                content: post?.content,
                createdAt: post?.createdAt,
                blogName: post?.blogName
            }
        })
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const returnPosts: ReturnViewModel<PostViewModel[]> = {
            page: +pageNumber,
            pageSize: +pageSize,
            pagesCount,
            totalCount,
            items: editedPost
        }
        return {status: ResultStatus.Success, data: returnPosts}
    }

    static async createPost(data: PostInputModel): Promise<ObjectResult<PostViewModel | null>> {

        const {blogId, content, shortDescription, title} = data
        const blog = await blogCollection.findOne({_id: new ObjectId(data.blogId)})
        //если блог не найден, пост нельзя создать
        if (!blog) {
            return {status: ResultStatus.BadRequest, errorMessage: 'Blog bot found', data: null}
        }
        const newPost: NewPostModel = {
            title,
            content,
            blogId,
            shortDescription,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        const createdPost = await PostRepository.createPost(newPost)
        if (!createdPost) return {
            status: ResultStatus.SomethingWasWrong,
            errorMessage: "Something was wrong",
            data: null
        }

        return {status: ResultStatus.Created, data: createdPost}
    }

    static async getCommentsForPost(postId: string, dataQuery: QueryType): Promise<ObjectResult<ReturnViewModel<CommentViewModel[]>>> {
        const result = await CommentService.getCommentsByPostId(postId, dataQuery)

        return {status: ResultStatus.Success, data: result.data}
    }

    static async updatePost(postId: string, data: PostInputModel): Promise<ObjectResult> {
        const post = await PostRepository.getPostById(postId)
        if(!post) return {status: ResultStatus.NotFound, errorMessage: 'Post not found', data: null}
        try {
            await PostRepository.updatePost(postId, data)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            console.warn(err)
            return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
        }

    }

    static async deletePost(postId: string): Promise<ObjectResult>{
        const post = await PostRepository.getPostById(postId)
        if(!post) return {status: ResultStatus.NotFound, errorMessage: 'Post not found', data: null}

    try {
        await PostRepository.deletePost(postId)
        return {status: ResultStatus.NoContent, data: null}
    } catch (err) {
        console.warn(err)
        return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}

    }
    }
}