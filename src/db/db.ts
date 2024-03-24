import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
import {app} from "../settings";
import {appConfig} from "../appConfig";

dotenv.config()


export const db = {
    client: new MongoClient(appConfig.MONGO_URL),
    async run() {
        try {
            await this.client.connect();
            console.log("Successfully connected to Atlas");
        } catch (err) {
            console.log(err);
        }
    }
}

// export async function runDB() {
//     try {
//         await client.connect();
//         console.log("Successfully connected to Atlas");
//     } catch (err) {
//         console.log(err);
//     }
//
// }

export const database = db.client.db("backhomework")

export const blogCollection = database.collection('blogs')
export const postCollection = database.collection('posts')
export const userCollection = database.collection('users')
export const commentCollection = database.collection('comments')