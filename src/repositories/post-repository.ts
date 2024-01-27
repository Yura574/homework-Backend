import {db} from '../db/db';
import {BlogViewModelType, PostInputModelType, PostViewModelType} from '../models/blogModels';
import {BlogRepository} from './blog-repository';
import {postCollection} from '../index';
import {ObjectId} from 'mongodb';


export class PostRepository {
    static getAllPost() {
        return db.posts
    }

    static getPostById(id: string) {
        return postCollection.findOne({_id: new ObjectId(id)})
    }
    //
    // static createPost(data: PostInputModelType) {
    //     const blog: BlogViewModelType | undefined = BlogRepository.getBlogById(data.blogId)
    //     if (!blog) {
    //         return false
    //     }
    //
    //     const {blogId, title, shortDescription, content} = data
    //     const newPost: PostViewModelType = {
    //         blogId,
    //         blogName: blog.name,
    //         title,
    //         shortDescription,
    //         content
    //     }
    //
    //     return newPost
    // }
    //
    // static deletePost(id: string) {
    //     const index = db.posts.findIndex(p => p.id === id)
    //     if (index >= 0) {
    //         db.posts.splice(index, 1)
    //         return true
    //     } else {
    //         return false
    //     }
    // }
    //
    // static updatePost(id: string, data: PostInputModelType) {
    //     const {title, shortDescription, content} = data
    //     const post = db.posts.find(p => p.id === id)
    //     if (post) {
    //         const updatedPost: PostViewModelType = {
    //             id,
    //             shortDescription,
    //             content,
    //             title,
    //             blogName: post.blogName,
    //             blogId: post.blogId
    //         }
    //         const index = db.posts.findIndex(p => p.id === id)
    //         db.posts.splice(index, 1, updatedPost)
    //         return true
    //     }
    //     return false
    // }
}