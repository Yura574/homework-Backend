import {BlogRepository} from '../repositories/blog-repository';
import {
    BlogItem,

    PostInputType,
    PostViewModelType,
    ReturnViewModelType,
} from '../models/blogModels';
import {PostRepository} from '../repositories/post-repository';
import {GetBlogsType, GetPostsType} from '../routes/blog-router';
import {postCollection} from '../db/db';


export class BlogService {

    static async getBlogs(data: GetBlogsType) {
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10, searchNameTerm} = data
        const {blogs, totalCount} = await BlogRepository.getAllBlogs(pageNumber, pageSize, sortBy, searchNameTerm, sortDirection)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const returnBlog: ReturnViewModelType<BlogItem[]> = {
            pagesCount,
            page: pageNumber.toString(),
            pageSize: +pageSize,
            totalCount,
            items: blogs.map(b => {
                return {
                    id: b._id.toString(),
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    isMembership: b.isMembership,
                    createdAt: b.createdAt
                }
            })
        }
        return returnBlog
    }

    static async getBlogById(id: string) {
        const blog = await BlogRepository.getBlogById(id)
        const returnBlog: BlogItem = {
            id: blog!._id.toString(),
            createdAt: blog?.createdAt,
            isMembership: blog?.isMembership,
            websiteUrl: blog?.websiteUrl,
            name: blog?.name,
            description: blog?.description
        }
        return returnBlog
    }

    static async getAllPostsByBlogId(blogId: string, data: GetPostsType) {

        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10, searchNameTerm=''} = data

        const {
            posts,
            totalCount
        } = await PostRepository.getAllPostsByBlogId(blogId, pageNumber, pageSize, searchNameTerm, sortBy, sortDirection)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const returnBlog: ReturnViewModelType<PostViewModelType[]> = {
            page: pageNumber.toString(),
            pageSize: +pageSize,
            pagesCount,
            totalCount,
            items: posts.map(post => {
                return {
                    id: post._id.toString(),
                    blogName: post.blogName,
                    content: post.content,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    createdAt: post.createdAt,
                    blogId: post.blogId

                }
            })
        }

        return returnBlog
    }

    static async createPostForBlog(blogId: string, data: PostInputType) {
        const {content, shortDescription, title} = data
        const newPost = await PostRepository.createPost({blogId, title, shortDescription, content})
        if (newPost) {
            const createdPost = await postCollection.insertOne(newPost)
            const post = await postCollection.findOne({_id: createdPost.insertedId})
            return {
                id: post?._id,
                blogId: post?.blogId,
                title: post?.title,
                blogName: post?.blogName,
                content: post?.content,
                shortDescription: post?.shortDescription,
                createdAt: post?.createdAt
            }
        }
        return false;
    }
}