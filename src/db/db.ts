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
            await mongoose.connect(appConfig.MONGO_URL + '/' + "backhomework",);
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
// export const database = db.client.db("backhomework")

// export const blogCollection = database.collection('blogs')
// export const postCollection = database.collection('posts')
// export const userCollection = database.collection('users')
// export const commentCollection = database.collection('comments')

// export const devicesCollection = database.collection('deviceAuth')

// export const recoveryPasswordCollection = database.collection('recoverPassword')

// export const ipRestrictionCollection = database.collection('ipRestrictions')
// export const blacklistTokenCollection = database.collection('blacklist')