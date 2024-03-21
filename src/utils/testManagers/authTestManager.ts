import {LoginInputModel} from "../../models/authModel";
import request from "supertest";
import {app, routerPaths} from "../../settings";
import {HTTP_STATUSES, HttpStatusType} from "../httpStatuses";


export const authTestManager = {
    async login(data: LoginInputModel, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
    const res = await request(app)
        .post(`${routerPaths.auth}/login`)
        .send(data)
        .expect(statusCode)
        console.log(res.status)
        return res.body
    }
}