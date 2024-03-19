import request from 'supertest';
import {app} from '../../src/settings';
import {clientTest} from "../../src/db/dbTest";
import {HTTP_STATUSES} from "../../src/utils/httpStatuses";


describe('tests for /blogs', () => {
    beforeAll(async () => {
        await clientTest.connect()
        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await clientTest.close();
    });
    describe('GET all blogs', () => {
        it('get all blogs', async () => {
            await request(app)
                .get('/blogs')
                .expect(HTTP_STATUSES.OK_200,{
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }
        )
        })
    })


})

