import {app, port} from './settings';
import {db} from './db/db';


// app.set('trust proxy', true)
app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(port, () => {
    db.run().catch(console.log);
    console.log(`App started ${port} port`)
})