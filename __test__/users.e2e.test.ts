import request from 'supertest'
import {app, routerPaths} from '../src/settings';
import {UserTestManager} from '../src/utils/userTestManager';
import {HTTP_STATUSES} from '../src/utils';
import {db, UserType} from '../src/db/db';

const data = {
    userName: 'new user'
}
describe('tests for /users', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/delete-all-data')
    })


    it('should return empty array ', async () => {
        await request(app)
            .get(`${routerPaths.users}/all`)
            .expect([])
    })

    it('should create new user', async () => {
       const {createdUser} = await UserTestManager.createUser(data)

        await UserTestManager.getUser(createdUser.id)
    })
    it(`shouldn't create new user`, async () => {
        await request(app)
            .post(routerPaths.users)
            .send({userName: 12})
            .expect(HTTP_STATUSES.BAD_REQUEST_400, [
                {
                    "field": "User",
                    "message": "User name incorrect"
                }
            ])

    })
    it(`should user name was changed`, async () => {
        const {createdUser} = await UserTestManager.createUser(data)
        if (createdUser) {
           await request(app)
                .put(`${routerPaths.users}/${createdUser.id}`)
                .send({userName: 'new user name'})
                .expect(HTTP_STATUSES.CHANGE_204)

     await UserTestManager.getUser(createdUser.id)


        }


    })
    it(`data user shouldn't be changed`, async () => {
        const {createdUser} = await UserTestManager.createUser(data)
        await request(app)
            .put(`${routerPaths.users}/100`)
            .send({userName: 'true'})
            .expect(404)
        if (createdUser) {
            const id = createdUser.id
            await request(app)
                .put(`${routerPaths.users}/${id}`)
                .send({userName: true})
                .expect([{field: 'User', message: 'User name incorrect'}])

            await request(app)
                .put(`${routerPaths.users}/${id}`)
                .send({userName: true})
                .expect([
                    {field: 'User', message: 'User name incorrect'},
                ])

        }

    })
    it('course should be deleted', async () => {
        const {createdUser} = await UserTestManager.createUser(data)
        if (createdUser) {
            const id = createdUser.id
           await UserTestManager.deleteUser(id)
        }
    })


})