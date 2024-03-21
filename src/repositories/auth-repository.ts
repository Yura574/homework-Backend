import bcrypt from "bcrypt";
import {UserRepository} from "./user-repository";
import {LoginInputModel} from "../models/authModel";
import jwt from "jsonwebtoken";


export class AuthRepository{
    static async login (data: LoginInputModel){
        const {loginOrEmail, password} = data
        const findUser = await UserRepository.foundUser(loginOrEmail)
        if(!findUser){
            return false
        }

        const isCompare =await bcrypt.compare(password, findUser.password)
        if(isCompare){
            const payload = {
                userId: findUser._id.toString(),
            }
            return  jwt.sign(payload, 'SECRET', {expiresIn: '1h'})

        }
        return false;

    }
}