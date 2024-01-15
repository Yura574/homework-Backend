import {db} from '../db/db';
import {BlogInputModelType, BlogViewModelType} from '../models/blogModels';

export class BlogRepository {
   static  getById(id: string) {
        return db.blogs.find(b => b.id === id);
    }

    static getAllBlogs() {
        return db.blogs;
    }

    static deleteBlog(id: string) {
        const index = db.blogs.findIndex(b => b.id === id)
        if (index >= 0) {
            db.blogs.splice(index, 1)
            return true
        }
        return false
    }

    static updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        const index = db.blogs.findIndex(b => b.id === id)
        if (index >= 0) {
            const updatedBlog: BlogViewModelType = {
                id,
                name,
                description,
                websiteUrl
            }
            db.blogs.splice(index, 1, updatedBlog)
            return true
        }
        return false
    }
}