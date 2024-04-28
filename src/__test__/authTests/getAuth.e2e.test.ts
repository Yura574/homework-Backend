import {connectToTestDB, disconnectFromTestDB} from "../coonectToTestDB";
import request from "supertest";
import {app} from "../../settings";
import {UserInputModel} from "../../models/userModels";
import {UsersTestManager} from "../1_testManagers/usersTestManager";
import {authTestManager} from "../1_testManagers/authTestManager";


describe('tests for /auth', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await disconnectFromTestDB()
    });


    describe('get information about current user', () => {

        it('should return information', async () => {
            const data: UserInputModel = {
                email: 'yura574@gmail.com',
                login: 'yura',
                password: '123456'
            }
            await UsersTestManager.createUser(data)
            const token = await authTestManager.login({loginOrEmail: data.login, password: data.password})
            // console.log(token)
            const result = await authTestManager.me(token.accessToken)
            expect(result.email).toBe(data.email)
            expect(result.login).toBe(data.login)
            expect(result.userId).toEqual(expect.any(String))
            // await authTestManager.me('admin')


        })


    })

})

