import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config()


export const urlMongo = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(urlMongo);
console.log(process.env.MONGO_URL)
console.log(process.env.PORT)

export async function runDB() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err);
    }

}
export const database = client.db("backhomework")

export const blogCollection = database.collection('blogs')
export const postCollection = database.collection('posts')
export const userCollection = database.collection('users')