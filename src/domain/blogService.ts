import {BlogRepository} from '../repositories/blog-repository';
import {
    BlogType,
    PostInputType,
    PostViewModelType,
    ReturnViewModelType,
} from '../models/blogModels';
import {PostRepository} from '../repositories/post-repository';
import {GetBlogsType, GetPostsType} from '../routes/blog-router';
import {postCollection} from '../db/db';


export class BlogService {

    static async getBlogs(data: GetBlogsType) {
        const {sortBy = 'createdAt', sortDirection = 'asc', pageNumber = 1, pageSize = 10, searchNameTerm} = data
        let direction = sortDirection
        const {blogs, totalCount} = await BlogRepository.getAllBlogs(pageNumber, pageSize, searchNameTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)
        if (sortDirection !== 'asc' && sortDirection !== 'desc') {
            direction = 'asc'
        }
        const items = blogs.sort((b1, b2): number => {
            if (b1[sortBy] > b2[sortBy]) {
                return direction === 'asc' ? 1 : -1
            }
            return 0
        })
        console.log(items)


        const returnBlog: ReturnViewModelType<BlogType[]> = {
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
        console.log(blog)
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

    static async getAllPostsByBlogId(blogId: string, data: GetPostsType) {

        const {sortBy = 'createdAt', sortDirection = 'asc', pageNumber = 1, pageSize = 10, searchNameTerm} = data

        let direction = sortDirection
        if (sortDirection !== 'asc' && sortDirection !== 'desc') {
            direction = 'asc'
        }
        const {
            posts,
            totalCount
        } = await PostRepository.getAllPostsByBlogId(blogId, pageNumber, pageSize, searchNameTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const items = posts.sort((b1, b2): number => {
            if (b1[sortBy] > b2[sortBy]) {
                return direction === 'asc' ? 1 : -1
            }
            return 0
        })
        const returnBlog: ReturnViewModelType<PostViewModelType[]> = {
            page: pageNumber,
            pageSize,
            pagesCount,
            totalCount,
            items: items.map(post => {
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
        // res.status(HTTP_STATUSES.NOT_FOUND_404).send('blog not found')
        return false;
        // return await PostRepository.createPost({blogId, title, shortDescription, content})
    }
}