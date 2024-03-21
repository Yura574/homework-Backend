import {clientTest} from "../../src/db/dbTest";
import {LoginInputModel, LoginSuccessViewModel} from "../../src/models/authModel";
import {authTestManager} from "../../src/utils/testManagers/authTestManager";


describe('tests for /auth', () => {
    beforeAll(async () => {
        await clientTest.connect()
    })
    afterAll(async () => {
        await clientTest.close();
    });


    describe('try login user to the system', () => {

        it('should return access token', async () => {
            const data: LoginInputModel = {
                loginOrEmail: 'yura',
                password: 'qwerty1'
            }
            const token: LoginSuccessViewModel = await authTestManager.login(data)
            expect(token).toEqual({
                accessToken: expect.any(String)
            })

        })

    })

})

