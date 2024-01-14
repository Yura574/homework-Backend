import {db} from '../db/db';

export class BlogRepository {
    static getById(value:number){
        return 1
    }

   static getAllBlogs(){
        return db.blogs
    }
}