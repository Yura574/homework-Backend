import {AuthModelType} from "../models/authModel";
import bcrypt from "bcrypt";
import {UserRepository} from "./user-repository";


export class AuthRepository{
    static async auth (data: AuthModelType){
        const {loginOrEmail, password} = data
        const user = await UserRepository.foundUser(loginOrEmail)
        if(!user){
            return false
        }
        // console.log(user)
        const isCompare =await bcrypt.compare(password, user.password)
        console.log('compare', isCompare)
        return isCompare;

    }
}