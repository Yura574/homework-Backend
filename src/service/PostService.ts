import {PostRepository} from '../repositories/post-repository';
import {QueryType} from '../routes/post-router';
import {LikeUserInfoType, NewestLikesType, NewPostModel, PostInputModel, PostViewModel} from "../models/postModels";
import {ReturnViewModel} from "../models/commonModels";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {CommentViewModel, LikeStatus} from "../models/commentModel";
import {CommentService} from "./CommentService";
import {BlogRepository} from "../repositories/blog-repository";
import {getLikesInfoForPost} from "../utils/getLikesForPost";
import {CommentRepository} from "../repositories/comment-repository";
import {UserRepository} from "../repositories/user-repository";
import {log} from "node:util";


export class PostService {
    constructor() {
    }

    static async getPosts(dataQuery: QueryType, userId: string): Promise<ObjectResult<ReturnViewModel<PostViewModel[]>>> {
        const {pageSize = 10, pageNumber = 1, sortBy = 'createdAt', sortDirection = 'desc'} = dataQuery

        const {posts, totalCount} = await PostRepository.getPosts(+pageSize, +pageNumber, sortBy, sortDirection)
        console.log(posts)
        const editedPost: PostViewModel[] = posts.map(post => {
            const likeInfo = getLikesInfoForPost(post, userId)
            console.log(likeInfo)
            return {
                id: post._id.toString(),
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                blogId: post.blogId,
                blogName: post.blogName,
                shortDescription: post.shortDescription,
                extendedLikesInfo: {
                    likesCount: likeInfo.likesCount,
                    dislikesCount: likeInfo.dislikesCount,
                    myStatus: likeInfo.userStatus,
                    newestLikes: likeInfo.newestLikes,
                }
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

    static async getPostById(postId: string, userId: string): Promise<ObjectResult<PostViewModel | null>> {
        const post = await PostRepository.getPostById(postId, userId)
        console.log(post)
        if (!post) return {status: ResultStatus.NotFound, errorsMessages: 'Post not found', data: null}
        const likeInfo = getLikesInfoForPost(post, userId)
        const returnPost: PostViewModel = {
            id: post._id.toString(),
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            blogId: post.blogId,
            blogName: post.blogName,
            shortDescription: post.shortDescription,
            extendedLikesInfo: {
                likesCount: likeInfo.likesCount,
                dislikesCount: likeInfo.dislikesCount,
                myStatus: likeInfo.userStatus,
                newestLikes: likeInfo.newestLikes,
            }
        }
        return {status: ResultStatus.Success, data: returnPost}
    }

    static async createPost(data: PostInputModel): Promise<ObjectResult<PostViewModel | null>> {
        const {blogId, content, shortDescription, title} = data
        const blog = await BlogRepository.getBlogById(data.blogId)
        //если блог не найден, пост нельзя создать
        if (!blog) {
            return {status: ResultStatus.BadRequest, errorsMessages: 'Blog bot found', data: null}
        }
        const newPost: NewPostModel = {
            title,
            content,
            blogId,
            shortDescription,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likeUserInfo: [],
                likesCount: 0,
                dislikesCount: 0,
            }
        }
        try {
            const createdPost = await PostRepository.createPost(newPost)
            return {status: ResultStatus.Created, data: createdPost}
        } catch (err) {
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }

    }

    static async getCommentsForPost(postId: string, userId: string, dataQuery: QueryType): Promise<ObjectResult<ReturnViewModel<CommentViewModel[]> | null>> {
        try {
            const post = await PostRepository.getPostById(postId, userId)
            if (!post) return {status: ResultStatus.NotFound, errorsMessages: 'Post not found', data: null}
            const result = await CommentService.getCommentsByPostId(postId, userId, dataQuery)
            return {status: ResultStatus.Success, data: result.data}
        } catch (err) {
            return {status: ResultStatus.SomethingWasWrong, data: null}
        }

    }

    static async updatePost(postId: string, userId: string, data: PostInputModel): Promise<ObjectResult> {
        const post = await PostRepository.getPostById(postId, userId)
        if (!post) return {status: ResultStatus.NotFound, errorsMessages: 'Post not found', data: null}
        try {
            await PostRepository.updatePost(postId, data)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            console.warn(err)
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }

    }

    static async deletePost(postId: string, userId: string): Promise<ObjectResult> {
        const post = await PostRepository.getPostById(postId, userId)
        if (!post) return {status: ResultStatus.NotFound, errorsMessages: 'Post not found', data: null}

        try {
            await PostRepository.deletePost(postId)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            console.warn(err)
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}

        }
    }

    static async setLikePost(postId: string, userId: string,login: string, likeStatus: LikeStatus): Promise<ObjectResult> {

        const findPost = await PostRepository.getPostById(postId, userId)
        if (!findPost) return {status: ResultStatus.NotFound, errorsMessages: 'Post not found', data: null}
        const likes = findPost.extendedLikesInfo.likeUserInfo.filter(post => post.likeStatus === 'Like')
        const dislikes = findPost.extendedLikesInfo.likeUserInfo.filter(post => post.likeStatus === 'Dislike')
        let likeCount = likes?.length
        if (!likeCount) likeCount = 0

        let dislikeCount = dislikes?.length
        if (!dislikeCount) dislikeCount = 0
        const myStatus = findPost.extendedLikesInfo.likeUserInfo.find(like => like.userId === userId)
        if (myStatus?.likeStatus === likeStatus) {
            console.log('llo')
            return  {status: ResultStatus.Success, data: null}

        }

        console.log(myStatus?.likeStatus)
const createdAt = new Date().toISOString()
        if (myStatus) {
            if (likeStatus === 'Like') {
                ++likeCount
                --dislikeCount
                await PostRepository.deleteLikeForPost(postId, userId, 'dislikesCount', dislikeCount)
                await PostRepository.setLikeForPost(postId, userId, likeStatus, 'likesCount', likeCount, login, createdAt )
                return {status: ResultStatus.Success, data: null}
            }
            if (likeStatus === 'Dislike') {
                --likeCount
                ++dislikeCount
                await PostRepository.deleteLikeForPost(postId, userId, 'likesCount', dislikeCount)
                await PostRepository.setLikeForPost(postId, userId, likeStatus, 'dislikesCount', dislikeCount, login, createdAt)
                return {status: ResultStatus.Success, data: null}
            }
            if (likeStatus === 'None') {
                if (myStatus.likeStatus === 'Like') {
                    --likeCount
                    await PostRepository.deleteLikeForPost(postId, userId, 'likesCount', likeCount)
                } else {
                    --dislikeCount
                    await PostRepository.deleteLikeForPost(postId, userId, 'dislikesCount', dislikeCount)
                }
                await PostRepository.deleteLikeForPost(postId, userId, 'likesCount', likeCount)
                await PostRepository.setLikeForPost(postId, userId, likeStatus, 'dislikesCount', dislikeCount, login, createdAt)
            }

        } else if (likeStatus === 'Like') {
            //Если пользовальтель лайк не ставил, то в зависимости от от статуса устанавливаем лайк или дизлайк
            ++likeCount
            await PostRepository.setLikeForPost(postId, userId, likeStatus, 'likesCount', likeCount, login, createdAt)
        } else if (likeStatus === 'Dislike') {
            ++dislikeCount
            await PostRepository.setLikeForPost(postId, userId, likeStatus, 'dislikesCount', dislikeCount, login, createdAt)
        }


        return {status: ResultStatus.Success, data: null}
    }
}