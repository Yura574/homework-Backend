import request from 'supertest'
import {app, routerPaths} from '../../src/settings';
import {UsersTestManager} from "../1_testManagers/usersTestManager";
import {UserInputModel, UserItemType} from "../../src/models/userModels";
import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/appConfig";
import {db} from "../../src/db/db";


describe('tests for /users', () => {
    beforeAll(async ()=> {
        const mongoServer = await  MongoMemoryServer.create()
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