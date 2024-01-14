import {db} from '../db/db';

export class BlogRepository {
    static getById(id:string){
        return db.blogs.find(b => b.id === id)
    }

   static getAllBlogs(){
        return db.blogs
    }
    static deleteBlog(id: string){
        const index = db.blogs.findIndex(b => b.id === id)
        if(index >= 0 ){
            console.log(index)
            db.blogs.splice(index, 1)
            return true
        }
        return false
    }
}