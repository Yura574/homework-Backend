import {LikeStatus} from "../models/commentModel";
import {LikeUserInfoType, NewestLikesType, PostDBType} from "../models/postModels";


export const getLikesInfoForPost = (post: PostDBType, userId: string) => {

    let userStatus: LikeStatus
    const likePosts: LikeUserInfoType[] = post.extendedLikesInfo.likeUserInfo

    let sortedLikePosts: LikeUserInfoType[] = likePosts.sort((a: LikeUserInfoType, b: LikeUserInfoType) => a.createdAt > b.createdAt ? -1 : 1)
    const likesCount = likePosts.filter((like: LikeUserInfoType) => like.likeStatus === 'Like')

    const dislikesCount = likePosts.filter((like: LikeUserInfoType) => like.likeStatus === 'Dislike')
    let newestLikes: NewestLikesType[] = []
    for (let i = 0; newestLikes.length < 3 && i < sortedLikePosts.length; i++) {
        if (sortedLikePosts[i].likeStatus === 'Like') {
            const post: NewestLikesType = {
                addedAt: sortedLikePosts[i].createdAt,
                userId: sortedLikePosts[i].userId,
                login: sortedLikePosts[i].login,
            }
            newestLikes.push(post)
        }
    }
    const findUserStatus = likePosts.find((likeStatus: LikeUserInfoType) => likeStatus.userId === userId)
    userStatus = findUserStatus ? findUserStatus.likeStatus : 'None'
    return {
        likesCount: likesCount.length,
        dislikesCount: dislikesCount.length,
        userStatus,
        newestLikes: newestLikes
    }
}