import {app, port} from './settings';
import {runDB} from './db/db';

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(port, () => {
    runDB().catch(console.log);
    console.log(`App started ${port} port`)
})