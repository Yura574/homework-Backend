import {app, port} from './settings';
import {MongoClient} from 'mongodb';

app.get('/', (req, res) => {
    res.send('hi')
})
export const urlMongo = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(urlMongo);
console.log(process.env.MONGO_URL)

async function runDB() {
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


app.listen(port, () => {
    runDB().catch(console.log);
    console.log(`App started ${port} port`)
})