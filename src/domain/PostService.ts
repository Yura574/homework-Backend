import {PostRepository} from '../repositories/post-repository';
import {PostItem, ReturnViewModelType} from '../models/blogModels';
import {QueryType} from '../routes/post-router';


export class PostService {
    static async getPosts(dataQuery: QueryType) {
        const {pageSize = 10, pageNumber = 1, sortBy = 'createdAt', sortDirection = 'desc'} = dataQuery

        const {posts, totalCount} = await PostRepository.getPosts(+pageSize, +pageNumber, sortBy)


        let direction = sortDirection
        if (sortDirection !== 'asc' && sortDirection !== 'desc') {
            direction = 'desc'
        }
        const sortedItems = posts.sort((b1, b2): number => {
            console.log(b1[sortBy] < b2[sortBy])
            if (b1[sortBy] < b2[sortBy]) {
                console.log(b1[sortBy] > b2[sortBy])
                return direction === 'asc' ? -1 : 1
            } else if (b1[sortBy] > b2[sortBy]) {
                console.log(b1[sortBy] > b2[sortBy])
                return direction === 'asc' ? 1 : -1
            }
            return 0

        })
        const editedPost: PostItem[] = sortedItems.map(post => {
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
        console.log(sortedItems)
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const returnPosts: ReturnViewModelType<PostItem[]> = {
            page: +pageNumber,
            pageSize: +pageSize,
            pagesCount,
            totalCount,
            items: editedPost
        }
        return returnPosts
    }

}