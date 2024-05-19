import {ObjectId} from 'mongodb';
import {
    NewPostModel,
    PostDBType,
    PostInputModel,
    PostViewModel
} from "../models/postModels";
import {CommentModel, PostModel} from "../db/db";
import {LikeStatus} from "../models/commentModel";


export class PostRepository {
    static async getPosts(pageSize: number, pageNumber: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const skip = (pageNumber - 1) * pageSize
        const totalCount = await PostModel.countDocuments()
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const posts = await PostModel.find({}).sort(sortObject).skip(skip).limit(pageSize).lean()
        return {posts, totalCount}
    }

    static async getPostById(postId: string, userId: string): Promise<PostDBType | null> {
        const post = await PostModel.findById({_id: postId})
        if (!post) return null

        return {
            _id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            createdAt: post.createdAt,
            blogId: post.blogId,
            blogName: post.blogName,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                likeUserInfo:post.extendedLikesInfo.likeUserInfo,
            }
        }
    }

    static async getAllPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, searchNameTerm: string, sortBy: string, sortDirection: 'asc' | 'desc') {
        let skip = (pageNumber - 1) * pageSize

        const totalCount = await PostModel.countDocuments({
            blogId,
            title: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}
        })
        if (skip > totalCount) {
            skip = 0
        }
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const posts = await PostModel.find({
            blogId,
            title: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}
        })
            .sort(sortObject).skip(skip).limit(+pageSize).lean();
        return {posts, totalCount}
    }

    static async createPost(newPost: NewPostModel) {
        console.log(657 )
        const createdPost = await PostModel.create(newPost)
        console.log(createdPost)
        const post = await PostModel.findOne({_id: createdPost._id})
        if (!post) return null
        const returnPost: PostViewModel = {
            id: post!._id.toString(),
            title: post.title,
            content: post?.content,
            shortDescription: post?.shortDescription,
            blogId: post?.blogId,
            blogName: post?.blogName,
            createdAt: post?.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [],
            }
        }
        return returnPost

    }

    static async deletePost(id: string) {
        try {
            await PostModel.deleteOne({_id: id})
            return true
        } catch (err) {
            return false
        }
    }

    static async updatePost(id: string, data: PostInputModel) {
        const {title, shortDescription, content} = data
        const updatedPost = {
            $set: {
                shortDescription,
                content,
                title,
            }

        }
        return PostModel.updateOne({_id: new ObjectId(id)}, updatedPost)
    }

    static async setLikeForPost(postId: string, userId: string, likeStatus: LikeStatus, likesCount: 'likesCount' | 'dislikesCount', count: number, login: string, createdAt: string) {
        return PostModel.findByIdAndUpdate( {_id: postId}, {
            $set: {
                [`extendedLikesInfo.${likesCount}`]: count,
            },
            $push: {
                ['extendedLikesInfo.likeUserInfo']: {userId, likeStatus, login, createdAt}
            }
        })
    }

    static async deleteLikeForPost(postId: string, userId: string, likesCount: 'likesCount' | 'dislikesCount', count: number) {
        return PostModel.findByIdAndUpdate({_id: postId}, {
                $set: {
                    [`extendedLikesInfo.${likesCount}`]: count,
                },
                $pull: {
                    'extendedLikesInfo.likeUserInfo': {userId}
                }
            }
        );
    }


}