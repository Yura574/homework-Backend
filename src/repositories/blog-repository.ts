import {db} from '../db/db';
import {BlogInputModelType, BlogViewModelType} from '../models/blogModels';
import {blogCollection} from '../index';

export class BlogRepository {
    static getBlogById(id: string) {
        return db.blogs.find(b => b.id === id);
    }

    static async getAllBlogs() {
        return  blogCollection.find({});
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