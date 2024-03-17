import {GetUsersQuery} from "../models/userModels";
import {BlogRepository} from "../repositories/blog-repository";
import {UserRepository} from "../repositories/user-repository";


export class UserService {
   static async getUsers  (query: GetUsersQuery) {
        const {
            // pageSize = 10,
            // pageNumber = 1,
            // sortBy = 'createdAt',
            // sortDirection = 'desc',
            // searchEmailTerm = null,
            // searchLoginTerm = null,
        } = query
        const {users, totalCount} = await UserRepository.getAllUsers(query)
       return users

    }
}