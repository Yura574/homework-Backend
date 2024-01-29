import {BlogRepository} from '../repositories/blog-repository';
import {BlogViewModelType} from '../models/blogModels';

export type GetBlogsType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    term?: string
}

export class BlogService {

    static async getBlogs(data: GetBlogsType) {
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber=2, pageSize=4} = data
        const blogs = await BlogRepository.getAllBlogs(pageNumber, pageSize)
        // const sortedBlog =
        return blogs
    }

    static async getBlogById(id: string) {
        const blog = await BlogRepository.getBlogById(id)
        const returnBlog: BlogViewModelType = {
            id: blog!._id.toString(),
            createdAt: blog?.createdAt,
            isMembership: blog?.isMembership,
            websiteUrl: blog?.websiteUrl,
            name: blog?.name,
            description: blog?.description
        }
        return returnBlog
    }
}