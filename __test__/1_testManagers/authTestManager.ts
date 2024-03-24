import {LoginInputModel, LoginSuccessViewModel} from "../../src/models/authModel";
import request from "supertest";
import {app, routerPaths} from "../../src/settings";
import {HTTP_STATUSES, HttpStatusType} from "../../src/utils/httpStatuses";
import {UserInputModel} from "../../src/models/userModels";


export const authTestManager = {
    async getToken() {
        const dataUser = {
            email: 'yura5742248@gmail.com',
            login: 'yura574',
            password: 'unbiliever13'
        }
        //create user
        await request(app)
            .post(`${routerPaths.users}`)
            .auth('admin', {type: 'bearer'})
            .send(dataUser)

        const data: LoginInputModel = {
            loginOrEmail: 'yura574',
            password: 'unbiliever13'
        }
        const token: LoginSuccessViewModel = await this.login(data)
        //
        // return token
    },

    async login(data: LoginInputModel, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const res = await request(app)
            .post(`${routerPaths.auth}/login`)
            .send(data)
            .expect(statusCode)
        return res.body
    },

    async me(token: string, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const res = await request(app)
            .get(`${routerPaths.auth}/me`)
            .auth(token, {type: 'bearer'})
            .expect(statusCode)
        return res.body
    },

    async registration(data: UserInputModel, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
       await request(app)
            .post(`${routerPaths.auth}/registration`)
            .send(data)
            .expect(statusCode)

    }
}