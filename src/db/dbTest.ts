import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config()


export const urlMongo = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const clientTest = new MongoClient(urlMongo);
export async function runDBTest() {
    try {
        await clientTest.connect();
        console.log("Successfully connected dbTest to Atlas");
    } catch (err) {
        console.log(err);
    }

}
export const database = clientTest.db("backForTest")

export const blogCollection = database.collection('blogs')
export const postCollection = database.collection('posts')
export const userCollection = database.collection('users')