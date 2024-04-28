import request from "supertest";
import {app, routerPaths} from "../../settings";
import {HTTP_STATUSES, HttpStatusType} from "../../utils/httpStatuses";
import {UserInputModel} from "../../models/userModels";


export const UsersTestManager = {

    async getAllUsers() {
        const res = await request(app)
            .get(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200)
        return res.body
    },

    async getUserById(token: string,id: string, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
       const res = await request(app)
            .get(`${routerPaths.users}/${id}`)
            .auth(token, {type: 'bearer'})
            .expect(statusCode)
        return res.body
    },

    async createUser(data: UserInputModel, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const res = await request(app)
            .post(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(statusCode)

        return res.body

    },


    async deleteUser(id: string, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        await request(app)
            .delete(`${routerPaths.users}/${id}`)
            .auth('admin', 'qwerty')
            .expect(statusCode)

    }
}