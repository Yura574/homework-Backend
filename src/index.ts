import {app, port} from './settings';
import {runDB} from './db/db';
import {runDBTest} from "./db/dbTest";

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(port, () => {
    runDB().catch(console.log);
    runDBTest().catch(console.log);
    console.log(`App started ${port} port`)
})