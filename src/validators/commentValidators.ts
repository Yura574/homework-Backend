import {body} from "express-validator";
import {LikeStatus,} from "../models/commentModel";


const contentValidator = body('content').trim()
    .notEmpty().withMessage({field: 'content', message: `content can't be empty`})
    .isString().withMessage({field: 'content', message: `content should be string`})
    .isLength({min: 20, max: 300}).withMessage({
        field: 'content',
        message: `min length content 20 symbols, max length content 300 symbols`
    })
export const likeStatusValidator = body('likeStatus').trim()
    .notEmpty().withMessage({field: 'likeStatus', message: `likeStatus can't be empty`})
    .isString().withMessage({field: 'likeStatus', message: `likeStatus should be string`})
    .custom(async (likeStatus) => {
        if (likeStatus === LikeStatus.None || likeStatus === LikeStatus.Like || likeStatus === LikeStatus.Dislike) {
            return true
        }
        throw new Error()
    }).withMessage({
        field: 'likeStatus', message: 'Like status incorrect'
    })


export const commentValidators = () => [contentValidator]