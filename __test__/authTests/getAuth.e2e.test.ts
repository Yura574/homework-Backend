import {clientTest} from "../../src/db/dbTest";
import {LoginInputModel, LoginSuccessViewModel} from "../../src/models/authModel";
import {authTestManager} from "../1_testManagers/authTestManager";
import {UserRepository} from "../../src/repositories/user-repository";
import request from "supertest";
import {app, routerPaths} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/utils/httpStatuses";
import {UsersTestManager} from "../1_testManagers/usersTestManager";
import {UserInputModel} from "../../src/models/userModels";

export const tokenForTests = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWZjYjQ4YjYzZDFhMjkxOTA4OTQ5MjgiLCJpYXQiOjE3MTEwNjAxMDcsImV4cCI6MTcxMTA2MzcwN30.e__5azM_CExknCm08s-1hRcRQz5vmKgTFn_wZsQ8R9E'
describe('tests for /auth', () => {
    beforeAll(async () => {
        await clientTest.connect()
        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await clientTest.close();
    });


    describe('get information about current user', () => {

        it('should return information', async () => {
            const data: UserInputModel = {
                email: 'yura574@gmail.com',
                login: 'yura',
                password: '123456'
            }
            await UsersTestManager.createTestUser(data)
            const token = await authTestManager.login({loginOrEmail: data.login, password: data.password})
            console.log(token)
            // await authTestManager.me('admin')


        })


    })

})

