import {app, port} from './settings';
import {MongoClient} from 'mongodb';


app.get('/', (req,res)=> {
    res.send('hi')
})
const url = 'mongodb+srv://yura574:unbiliever13@cluster0.zlgf1i6.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url!);
async function runDB() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
}

export const blogCollection = client.db().collection('blogs')


app.listen(port, ()=> {
    runDB().catch(console.dir);
    console.log(`App started ${port} port`)
})