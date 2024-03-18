import request from 'supertest'
import {app, routerPaths} from '../../src/settings';
import {UsersTestManager} from "../../src/utils/testManagers/usersTestManager";
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

    it('user should be deleted', async () => {
        const user = await UsersTestManager.createTestUser()

        await UsersTestManager.deleteUser(user.id)
    })

    it('user should`t be deleted', async () => {
        await UsersTestManager.deleteUser('user.id', HTTP_STATUSES.NOT_FOUND_404)
    })

})