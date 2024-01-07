import {app, port} from './settings';


app.get('/', (req,res)=> {
    res.send('hi')
})


app.listen(port, ()=> {
    console.log(`App started ${port} port`)
})