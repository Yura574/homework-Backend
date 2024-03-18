import express, {Response} from "express";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {ParamsType, RequestType, ResponseType} from "./blog-router";
import {userValidation, validateId} from "../validators/userValidators";
import {CreateUserBodyType, ReturnsUserType} from "./types/usersTypes";
import {ValidateError} from "../utils/validateError";
import {UserRepository} from "../repositories/user-repository";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {GetUsersQuery, UserItemType, UserViewModel,} from "../models/userModels";
import {ReturnViewModelType} from "../models/blogModels";
import {ResponsePostType} from "./post-router";
import {userCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const userRouter = express.Router()


userRouter.get('/', authMiddleware, async (req: RequestType<{}, {}, GetUsersQuery>, res: ResponsePostType<ReturnViewModelType<UserItemType[]>>) => {
    const {totalCount, users, pagesCount, pageSize, pageNumber} = await UserRepository.getAllUsers(req.query)
    const returnUsers: ReturnViewModelType<UserItemType[]> = {
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount,
        pagesCount,
        items: users.map(user => {
            return {
                id: user._id.toString(),
                email: user.email,
                login: user.login,
                createdAt: user.createdAt
            }
        })

    }
    res.send(returnUsers)

})
userRouter.get('/:id', validateId, async (req: RequestType<ParamsType, {}, {}>, res: ResponseType<UserViewModel>) => {
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const response = await userCollection.findOne({_id: new ObjectId(req.params.id)})
    if (response) {
        const user: UserViewModel = {
            id: response?._id.toString(),
            login: response.login,
            email: response.email,
            createdAt: response.createdAt
        }
        res.status(HTTP_STATUSES.OK_200).send(user)
        return

    }
    res.sendStatus(500)
    return



})

userRouter.post('/', authMiddleware, userValidation(), async (req: RequestType<{}, CreateUserBodyType, {}>, res: ResponseType<{}>) => {
    const isError = ValidateError(req, res)
    //если есть ошибка, validateError возвращает клиенту ошибку,
    if (isError) return

    const newUser = await UserRepository.createUser(req.body)

    if (newUser) {
        const user: ReturnsUserType = {
            id: newUser._id.toString(),
            createdAt: newUser.createdAt,
            login: newUser.login,
            email: newUser.email
        }
        res.status(HTTP_STATUSES.CREATED_201).send(user)
        return
    }

    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

})

userRouter.delete('/:id', authMiddleware,validateId, async (req: RequestType<ParamsType, {}, {}>, res: Response) => {
const isError = ValidateError(req,res)
    if(isError) return
    const isDeleted = await UserRepository.deleteUser(req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    } else {
        res.status(HTTP_STATUSES.NOT_FOUND_404).send('user not found')
        return
    }
})