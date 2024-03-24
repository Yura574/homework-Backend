import {HTTP_STATUSES, HttpStatusType} from "../../src/utils/httpStatuses";
import {UserInputModel} from "../../src/models/userModels";
import request from "supertest";
import {app, routerPaths} from "../../src/settings";


export const UsersTestManager = {

    async getAllUsers() {
        const res = await request(app)
            .get(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.OK_200)

        expect(res.body).toEqual({
            page: 1,
            pageSize: 10,
            totalCount: 1,
            pagesCount: 1,
            items: expect.any(Array)
        })
        return res.body
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
            .auth('admin', {type:'bearer'})
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
    async createTestUser( data: UserInputModel,statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const res = await request(app)
            .post(`${routerPaths.users}`)
            .auth('admin', {type:'bearer'})
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