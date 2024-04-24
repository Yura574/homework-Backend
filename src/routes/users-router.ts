import express, {Response} from "express";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {ParamsType, RequestType, ResponseType} from "./blog-router";
import {userValidation, validateId} from "../validators/userValidators";
import {CreateUserBodyType, ReturnsUserType} from "./types/usersTypes";
import {ValidateErrorRequest} from "../utils/validateErrorRequest";
import {UserRepository} from "../repositories/user-repository";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {GetUsersQuery,  UserViewModel,} from "../models/userModels";
import {ResponsePostType} from "./post-router";
import {ObjectId} from "mongodb";
import {ReturnViewModel} from "../models/commonModels";
import {UserService} from "../service/UserService";
import {ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";
import {UsersModel} from "../db/db";

export const userRouter = express.Router()


userRouter.get('/', authMiddleware, async (req: RequestType<{}, {}, GetUsersQuery>, res: ResponsePostType<ReturnViewModel<UserViewModel[]>>) => {
    const {totalCount, users, pagesCount, pageSize, pageNumber} = await UserRepository.getAllUsers(req.query)
    const returnUsers: ReturnViewModel<UserViewModel[]> = {
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
userRouter.get('/:id', authMiddleware, validateId, async (req: RequestType<ParamsType, {}, {}>, res: ResponseType<UserViewModel>) => {
    const isError = ValidateErrorRequest(req, res)
    if (isError) {
        return
    }
    const response = await UsersModel.findById({id: req.params.id})
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

userRouter.post('/', authMiddleware, userValidation(), async (req: RequestType<{}, CreateUserBodyType, {}>, res: ResponseType<ReturnsUserType | null>) => {
    const isError = ValidateErrorRequest(req, res)
    //если есть ошибка, validateError возвращает клиенту ошибку,
    if (isError) return
const result = await UserService.createUser(req.body)
    // const newUser = await UserRepository.createUser(req.body)

 if(result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.CREATED_201).send(result.data)
return handleErrorObjectResult(result, res)
})

userRouter.delete('/:id', authMiddleware,validateId, async (req: RequestType<ParamsType, {}, {}>, res: Response) => {
const isError = ValidateErrorRequest(req,res)
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