import {HTTP_STATUSES, HttpStatusType} from "../httpStatuses";
import {UserInputModel} from "../../models/userModels";
import request from "supertest";
import {app, routerPaths} from "../../settings";


export const UsersTestManager = {

    async getAllUsers() {
        const res = await request(app)
            .get(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200)

        expect(res.body).toEqual({
            page: 1,
            pageSize: 10,
            totalCount: 0,
            pagesCount: 0,
            items: []
        })
    },

    async getUserById(id: string, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        await request(app)
            .get(`${routerPaths.users}/${id}`)
            .auth('admin', 'qwerty')
            .expect(statusCode)
    },

    async createUser(data: UserInputModel, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const res = await request(app)
            .post(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(statusCode)

        let createdUser
        if (statusCode === HTTP_STATUSES.CREATED_201) {
            createdUser = res.body
            expect(createdUser).toEqual({
                id: expect.any((String)),
                login: data.login,
                email: data.email,
                createdAt: expect.any(String)
            })

        }
        return {createdUser}
    },
    async createTestUser( statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const data: UserInputModel = {
            email: 'yura574@gmail.com',
            login: 'yura',
            password: '123456'
        }
        const res = await request(app)
            .post(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(statusCode)


        return res.body
    },

    async deleteUser(id: string, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204){
        await request(app)
            .delete(`${routerPaths.users}/${id}`)
            .auth('admin', 'qwerty')
            .expect(statusCode)

    }
}