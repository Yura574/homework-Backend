import {connectToTestDB, disconnectFromTestDB} from "../coonectToTestDB";
import request from "supertest";
import {app, routerPaths} from "../../settings";
import {UserInputModel, UserViewModel} from "../../models/userModels";
import {UsersTestManager} from "../1_testManagers/usersTestManager";
import {authTestManager} from "../1_testManagers/authTestManager";


describe('tests for POST /users', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    beforeEach(async () => {

        await request(app).delete('/testing/all-data')
    })
    afterAll(async () => {
        await disconnectFromTestDB()
    });


    it('should create new user', async () => {
        const data: UserInputModel = {
            email: 'yura574@gmail.com',
            login: 'yura',
            password: '123456'
        }
        const createdUser: UserViewModel = await UsersTestManager.createUser(data)
        const token = await authTestManager.login({loginOrEmail: data.login, password: data.password})
        const user = await UsersTestManager.getUserById(token.accessToken,createdUser.id)
        expect(user).toEqual({
            id: expect.any(String),
            login: createdUser.login,
            email: createdUser.email,
            createdAt: expect.any(String),
        })
    })

    it('shouldn`t be created user', async () => {
        const data = {
            email: 'yura574@gmail',
            password: '12345'
        }
        await request(app)
            .post(`${routerPaths.users}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(400, {
                errorsMessages: [
                    {
                        field: 'login',
                        message: 'login is required'
                    },
                    {
                        field: 'password',
                        message: 'min length 6 symbols, max length 20 symbols'
                    },
                    {
                        field: 'email',
                        message: 'email incorrect'
                    },
                ]
            })
    })


})