import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
import {appConfig} from "../appConfig";
import mongoose from "mongoose";

dotenv.config()


export const db = {
    client: new MongoClient(appConfig.MONGO_URL),
    async run() {
        try {
            await mongoose.connect(appConfig.MONGO_URL);
            console.log("Successfully connected to Atlas");
        } catch (err) {
            console.log(err);
        }
    }
}

export const database = db.client.db("backhomework")

export const blogCollection = database.collection('blogs')
export const postCollection = database.collection('posts')
export const userCollection = database.collection('users')
export const commentCollection = database.collection('comments')

export const devicesCollection = database.collection('deviceAuth')

export const recoveryPasswordCollection = database.collection('recoverPassword')

export const ipRestrictionCollection = database.collection('ipRestrictions')
export const blacklistTokenCollection = database.collection('blacklist')