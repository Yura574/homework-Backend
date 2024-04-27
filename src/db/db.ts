import dotenv from 'dotenv';
import {appConfig} from "../appConfig";
import mongoose from "mongoose";
import {PostSchema} from '../models/postModels';
import {BlogSchema} from "../models/blogModels";
import {CommentSchema} from "../models/commentModel";
import {SecurityDeviceSchema} from "../models/deviceAuthModel";
import { RecoveryPasswordSchema} from "../models/recoveryPasswordModel";
import {IpRestrictionSchema} from "../models/ipRestrictionModel";
import {UserSchema} from "../models/userModels";

dotenv.config()


export const db = {
    // client: new MongoClient(appConfig.MONGO_URL),
    async run() {
        try {
            await mongoose.connect(appConfig.MONGO_URL);
            console.log("Successfully connected to Atlas");
        } catch (err) {
            console.log(err);
            await mongoose.disconnect()
        }
    }
}

export const BlogModel = mongoose.model('blogs', BlogSchema)
export const PostModel = mongoose.model('posts', PostSchema)
export const UsersModel = mongoose.model('users', UserSchema)
export const CommentModel = mongoose.model('comments', CommentSchema)

export const SecurityDeviceModel = mongoose.model('securityDevices', SecurityDeviceSchema)

export const RecoveryPasswordModel = mongoose.model('recoverPassword', RecoveryPasswordSchema)
export const IpRestrictionModel = mongoose.model('ipRestriction', IpRestrictionSchema)
