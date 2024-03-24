import {LoginInputModel, LoginSuccessViewModel} from "../../src/models/authModel";
import {authTestManager} from "../1_testManagers/authTestManager";
import {UserRepository} from "../../src/repositories/user-repository";
import request from "supertest";
import {app, routerPaths} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/utils/httpStatuses";
import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/appConfig";
import {db} from "../../src/db/db";
import {UserInputModel} from "../../src/models/userModels";


describe('tests for /auth', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        appConfig.MONGO_URL = mongoServer.getUri()
        await db.run()
    })
    beforeEach(async () => {

        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await db.client.close();
    });


    describe('try login user to the system', () => {

        it('should return access token', async () => {
            await UserRepository.createUser({
                email: 'yura5742248@gmail.com',
                login: 'yura574',
                password: 'unbiliever13'
            })
            const data: LoginInputModel = {
                loginOrEmail: 'yura574',
                password: 'unbiliever13'
            }
            const token: LoginSuccessViewModel = await authTestManager.login(data)

            expect(token).toEqual({
                accessToken: expect.any(String)
            })

        })
        it('data fields is requires ', async () => {
            await UserRepository.createUser({
                email: 'yura5742248@gmail.com',
                login: 'yura574',
                password: 'unbiliever13'
            })

            const data = {}

            await request(app)
                .post(`${routerPaths.auth}/login`)
                .send(data)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {field: 'loginOrEmail', message: `login or email can't be empty`},
                        {field: 'password', message: `password can't be empty`}
                    ]
                })
        });


        it('data fields should be string ', async () => {
            await UserRepository.createUser({
                email: 'yura5742248@gmail.com',
                login: 'yura574',
                password: 'unbiliever13'
            })

            const data = {
                loginOrEmail: true,
                password: 43
            }
            await request(app)
                .post(`${routerPaths.auth}/login`)
                .send(data)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {field: 'loginOrEmail', message: 'login or email should be string'},
                        {field: 'password', message: 'password should be string'}
                    ]
                })
        });

    })

    describe('Registration in the system. Email with confirmation code will be send to passed email address', () => {
        it('Email with confirmation code should be send to pass email address', async () => {
            const data: UserInputModel = {
                email: 'yura5742248@gmail.com',
                login: 'yura',
                password: 'password'
            }
            await authTestManager.registration(data)

        })

    })

})

