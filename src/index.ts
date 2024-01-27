import {app, port} from './settings';
import {MongoClient} from 'mongodb';


app.get('/', (req,res)=> {
    res.send('hi')
})
const url = 'mongodb+srv://yura574:unbiliever13@cluster0.zlgf1i6.mongodb.net/?retryWrites=true&w=majority'
export const client = new MongoClient(url!);
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


app.listen(port, ()=> {
    runDB().catch(console.log);
    console.log(`App started ${port} port`)
})