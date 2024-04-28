import {connectToTestDB, disconnectFromTestDB} from "../coonectToTestDB";
import request from "supertest";
import {app} from "../../settings";
import {UsersTestManager} from "../1_testManagers/usersTestManager";
import {UserInputModel} from "../../models/userModels";
import {HTTP_STATUSES} from "../../utils/httpStatuses";
import {authTestManager} from "../1_testManagers/authTestManager";


describe('tests for /users', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    beforeEach(async () => {
        await request(app).delete('/testing/all-data')
    })
    afterAll(async () => {
        await disconnectFromTestDB()
    });


    it('should return empty array ', async () => {
       const users =  await UsersTestManager.getAllUsers()
        expect(users).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: expect.any(Array)
        })
        expect(users.items.length).toBe(0)
    })
    it('should return array users ', async () => {
        for(let i = 0; i< 10; i++){
            await UsersTestManager.createUser({email: `email${i}@gmail.com`,login: `name${i}`, password: '123456'})
        }
       const users =  await UsersTestManager.getAllUsers()
        expect(users).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 10,
            items: expect.any(Array)
        })
        expect(users.items.length).toBe(10)
        expect(users.items[0].login).toBe('name9')
    })

    it('should return user by id', async () => {
        const data: UserInputModel = {
            email: 'yura574@gmail.com',
            login: 'yura',
            password: '123456'
        }
        const createdUser = await UsersTestManager.createUser(data)
        const token = await authTestManager.login({loginOrEmail: data.login, password: data.password})
        await UsersTestManager.getUserById(token.accessToken, createdUser.id)
    })

    it('should`t return user by id', async () => {
        const data: UserInputModel = {
            email: 'yura574@gmail.com',
            login: 'yura',
            password: '123456'
        }
        const createdUser = await UsersTestManager.createUser(data)
        const token = await authTestManager.login({loginOrEmail: data.login, password: data.password})

        await UsersTestManager.getUserById(token.accessToken,'createdUser.id', HTTP_STATUSES.NOT_FOUND_404)
    })

})