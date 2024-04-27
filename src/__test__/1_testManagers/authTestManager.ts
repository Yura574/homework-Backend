import request from "supertest";
import {app, routerPaths} from "../../settings";
import {LoginInputModel, LoginSuccessViewModel} from "../../models/authModel";
import {HTTP_STATUSES, HttpStatusType} from "../../utils/httpStatuses";
import {UserInputModel} from "../../models/userModels";


export const authTestManager = {


    async login(data: LoginInputModel, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const res = await request(app)
            .post(`${routerPaths.auth}/login`)
            .send(data)
            .expect(statusCode)
        return res.body
    },
    async getToken() {
        const dataUser = {
            email: 'yura5742248@gmail.com',
            login: 'yura574',
            password: 'unbiliever13'
        }
        //create user
        await request(app)
            .post(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .send(dataUser)

        const data: LoginInputModel = {
            loginOrEmail: 'yura574',
            password: 'unbiliever13'
        }
        const token: LoginSuccessViewModel = await this.login(data)

        return token
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