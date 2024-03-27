import {BlogRepository} from '../repositories/blog-repository';
import {BlogPostInputModel, BlogViewModel} from '../models/blogModels';
import {PostRepository} from '../repositories/post-repository';
import {GetBlogsType, GetPostsType} from '../routes/blog-router';
import {ReturnViewModel} from "../models/commonModels";
import {PostViewModel} from "../models/postModels";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {PostService} from "./PostService";


export class BlogService {

    static async getBlogs(data: GetBlogsType): Promise<ObjectResult<ReturnViewModel<BlogViewModel []>>> {
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10, searchNameTerm} = data
        const {
            blogs,
            totalCount
        } = await BlogRepository.getAllBlogs(pageNumber, pageSize, sortBy, searchNameTerm, sortDirection)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const returnBlog: ReturnViewModel<BlogViewModel[]> = {
            pagesCount,
            page: +pageNumber,
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
        return {
            status: ResultStatus.Success, data: returnBlog
        }
    }

    static async getBlogById(id: string): Promise<ObjectResult<BlogViewModel | null>> {
        const blog = await BlogRepository.getBlogById(id)
        if (!blog) return {status: ResultStatus.BadRequest, errorMessage: 'Blog not found', data: null}
        const returnBlog: BlogViewModel = {
            id: blog!._id.toString(),
            createdAt: blog?.createdAt,
            isMembership: blog?.isMembership,
            websiteUrl: blog?.websiteUrl,
            name: blog?.name,
            description: blog?.description
        }
        return {status: ResultStatus.Success, data: returnBlog}
    }

    static async getAllPostsByBlogId(blogId: string, data: GetPostsType): Promise<ObjectResult<ReturnViewModel<PostViewModel[]> | null>> {

        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10, searchNameTerm = ''} = data
        const blog = await BlogRepository.getBlogById(blogId)
        if (!blog) return {status: ResultStatus.NotFound, errorMessage: 'Blog nor found', data: null}
        const {
            posts,
            totalCount
        } = await PostRepository.getAllPostsByBlogId(blogId, pageNumber, pageSize, searchNameTerm, sortBy, sortDirection)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const returnBlog: ReturnViewModel<PostViewModel[]> = {
            page: +pageNumber,
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

        return {status: ResultStatus.Success, data: returnBlog}
    }

    static async createPostForBlog(blogId: string, data: BlogPostInputModel): Promise<ObjectResult<PostViewModel | null>> {
        const blog = await BlogRepository.getBlogById(blogId)
        if (!blog) return {status: ResultStatus.NotFound, errorMessage: "Blog not found", data: null}
        return await PostService.createPost({blogId, ...data})
    }

    static async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<ObjectResult> {
        const blog = await BlogService.getBlogById(blogId)
        if (!blog) {
            return {status: ResultStatus.NotFound, errorMessage: 'Blog not found', data: null}
        }
        try {
            await BlogRepository.updateBlog(blogId, name, description, websiteUrl)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
        }
    }

    static async deleteBlog(blogId: string): Promise<ObjectResult> {
        const blog = await BlogRepository.getBlogById(blogId)

        if (!blog) return {status: ResultStatus.NotFound, errorMessage: 'Blog not found', data: null}
        try {
        const res =     await BlogRepository.deleteBlog(blogId)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
        }
    }
}