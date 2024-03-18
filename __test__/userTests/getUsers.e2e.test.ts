import request from 'supertest'
import {app, routerPaths} from '../../src/settings';
import {UsersTestManager} from "../../src/utils/testManagers/usersTestManager";
import {UserInputModel, UserItemType} from "../../src/models/userModels";
import {HTTP_STATUSES} from "../../src/utils/httpStatuses";
import {clientTest} from "../../src/db/dbTest";


describe('tests for /users', () => {
    beforeEach(async () => {
        await clientTest.connect()

        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await clientTest.close();
    });


    it('should return empty array ', async () => {
        await UsersTestManager.getAllUsers()
    })

    it('should return user by id', async ()=> {
        const data: UserInputModel = {
            email: 'yura574@gmail.com',
            login: 'yura',
            password: '123456'
        }
        const {createdUser} = await UsersTestManager.createUser(data)
        await UsersTestManager.getUserById(createdUser.id)
    })

    it('should`t return user by id', async ()=> {

        await UsersTestManager.getUserById('createdUser.id', HTTP_STATUSES.NOT_FOUND_404)
    })

})