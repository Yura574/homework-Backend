import request from 'supertest'
import {app, routerPaths} from '../src/settings';


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

    it('should return not found users', async () => {
        await request(app)
            .get(routerPaths.users)
            .expect(404)

    })

    it('should create new user', async () => {
        const response = await request(app)
            .post(routerPaths.users)
            .send({userName: 'new user'})
            .expect(201)

        const createdUser = response.body

        expect(createdUser).toEqual({
            id: expect.any(Number),
            userName: 'new user',
        })

    })
    it(`shouldn't create new user`, async () => {
        await request(app)
            .post(routerPaths.users)
            .send({userName: 12})
            .expect(400, [
                {
                    "field": "User",
                    "message": "User name incorrect"
                }
            ])

    })
    it(`should user name was changed`, async () => {
        const course = await request(app)
            .get(`${routerPaths.users}/all`)
        const allUsers = course.body
        if (allUsers) {
            await request(app)
                .put(`${routerPaths.users}/${allUsers[0].id}`)
                .send({userName: 'new user name'})
                .expect(204)
            await request(app)
                .get(`${routerPaths.users}/${allUsers[0].id}`)
                .send({
                    title: 'new user name',
                })

        }


    })
    it(`data user shouldn't be changed`, async () => {
        const allUsers = await request(app)
            .get(`${routerPaths.users}/all`)
        await request(app)
            .put(`${routerPaths.users}/100`)
            .send({userName: 'true'})
            .expect(404)
        if (allUsers) {
            const id = allUsers.body[0].id
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
    it('course should be deleted', async ()=> {
        const allUsers = await request(app)
            .get(`${routerPaths.users}/all`)
        if(allUsers){
            const id = allUsers.body[0].id
            await request(app)
                .delete(`${routerPaths.users}/${id}`)
                .expect(204)
        }
    })


})