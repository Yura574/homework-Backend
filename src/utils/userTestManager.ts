import request from 'supertest';
import {app, routerPaths} from '../settings';
import {CreateUserModel} from '../models/userModels';
import {HTTP_STATUSES, HttpStatusType} from './httpStatuses';

export const UserTestManager = {
   async  createUser (data: CreateUserModel, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201){
       const res =  await request(app)
            .post(routerPaths.users)
            .send(data)
            .expect(statusCode)
       let createdUser
       if(statusCode === 201){
           createdUser = res.body
           expect(createdUser).toEqual({
               id: expect.any(Number),
               userName: data.userName,
           })
       }
       return {res, createdUser}
    },
    async getUser (id: number,  statusCode: HttpStatusType = HTTP_STATUSES.OK_200){
     const res =  await request(app)
           .get(`/users/${id}`)
           .expect(statusCode)

     return res.body
    },
    async deleteUser (id: number, statusCode: HttpStatusType = HTTP_STATUSES.CHANGE_204){
       await request(app)
           .delete(`/users/${id}`)
           .expect(statusCode)
    }
}