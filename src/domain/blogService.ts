import {BlogRepository} from '../repositories/blog-repository';
import {BlogType, BlogViewModelType} from '../models/blogModels';

export type GetBlogsType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    term?: string
}

export class BlogService {

    static async getBlogs(data: GetBlogsType) {
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = data
        let direction = sortDirection
        const {blogs, totalCount} = await BlogRepository.getAllBlogs(pageNumber, pageSize)
        const pagesCount = Math.ceil(totalCount / pageSize)
        if (sortDirection !== 'asc' && sortDirection !== 'desc') {
            direction = 'desc'
        }
        const items = blogs.sort((b1, b2): number => {
            if (b1[sortBy] > b2[sortBy]) {
                return direction === 'asc' ? 1 : -1
            }
            return 0
        })


        const returnBlog: BlogViewModelType = {
            page: pageNumber,
            pageSize,
            pagesCount,
            totalCount,
            items: items.map(b => {
                return {
                    id: b._id.toString(),
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    createdAt: b.createdAt,
                    isMembership: b.isMembership

                }
            })
        }
        return returnBlog
    }

    static async getBlogById(id: string) {
        const blog = await BlogRepository.getBlogById(id)
        const returnBlog: BlogType = {
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