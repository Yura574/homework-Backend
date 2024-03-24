import request from 'supertest'
import {app, routerPaths} from '../../src/settings';
import {UsersTestManager} from "../1_testManagers/usersTestManager";
import {HTTP_STATUSES} from "../../src/utils/httpStatuses";
import {clientTest} from "../../src/db/dbTest";
import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/appConfig";
import {UserInputModel} from "../../src/models/userModels";
import {db} from "../../src/db/db";


describe('tests for /users', () => {
    beforeAll(async ()=> {
        const mongoServer = await MongoMemoryServer.create()
        appConfig.MONGO_URL = mongoServer.getUri()
        await db.run()
    })
    beforeEach(async () => {
        await clientTest.connect()

        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await clientTest.close();
    });

    it('user should be deleted', async () => {
        const data: UserInputModel={
            login: 'login',
            email: 'email',
            password: 'password'

        }
        const {createdUser} = await UsersTestManager.createUser(data)

        await UsersTestManager.deleteUser(createdUser.id)
    })

    it('user should`t be deleted', async () => {
        await UsersTestManager.deleteUser('user.id', HTTP_STATUSES.NOT_FOUND_404)
    })

})