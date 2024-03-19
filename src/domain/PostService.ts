import {PostRepository} from '../repositories/post-repository';
import {QueryType} from '../routes/post-router';
import {PostViewModel} from "../models/postModels";
import {ReturnViewModelType} from "../models/commonModels";


export class PostService {
    static async getPosts(dataQuery: QueryType) {
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
        const returnPosts: ReturnViewModelType<PostViewModel[]> = {
            page: +pageNumber,
            pageSize: +pageSize,
            pagesCount,
            totalCount,
            items: editedPost
        }
        return returnPosts
    }

}