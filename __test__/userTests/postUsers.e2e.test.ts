import request from 'supertest'
import {app, routerPaths} from '../../src/settings';
import {UsersTestManager} from "../../src/utils/testManagers/usersTestManager";
import {UserInputModel, UserItemType} from "../../src/models/userModels";
import {clientTest} from "../../src/db/dbTest";


describe('tests for /users', () => {
    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    afterAll(async () => {
        await clientTest.close();
    });


    it('should create new user', async () => {
        const data: UserInputModel = {
            email: 'yura574@gmail.com',
            login: 'yura',
            password: '123456'
        }
        const {createdUser} = await UsersTestManager.createUser(data)

        await UsersTestManager.getUserById(createdUser.id)
    })

    it('shouldn`t be created user', async ()=> {
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