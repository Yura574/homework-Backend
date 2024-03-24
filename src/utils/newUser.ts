import bcrypt from "bcrypt";
import {UserCreateModel} from "../models/userModels";
import {v4} from "uuid";
import {add} from "date-fns";


export const newUser = async (email: string, login: string, password: string, isConfirm: boolean = false)=> {
    const hashPassword = await bcrypt.hash(password, 10)
    const user: UserCreateModel= {
        email,
        login,
        password: hashPassword,
        createdAt: new Date(),
        emailConfirmation: {
            isConfirm,
            confirmationCode: v4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 10
            })
        }
    }
    return user
}