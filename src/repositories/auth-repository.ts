import bcrypt from "bcrypt";
import {UserRepository} from "./user-repository";
import {LoginInputModel, LoginResponse} from "../models/authModel";
import jwt from "jsonwebtoken";
import {ObjectResult, ResultStatus} from "../utils/objectResult";


export class AuthRepository {
    static async login(data: LoginInputModel): Promise<ObjectResult<LoginResponse | null>> {
        const {loginOrEmail, password} = data
        const findUser = await UserRepository.findUser(loginOrEmail)
        if (!findUser) {
            return {status: ResultStatus.Unauthorized, errorMessage: 'User or password incorrect', data: null}
        }

        const isCompare = await bcrypt.compare(password, findUser.password)
        if (isCompare) {
            const payload = {userId: findUser._id.toString(),}
            return {
                status: ResultStatus.Success,
                data:{
                    accessToken: jwt.sign(payload, 'SECRET', {expiresIn: '1h'})
                }
            }

        }
        return {status: ResultStatus.Unauthorized, errorMessage: 'User or password incorrect', data: null}

    }
}