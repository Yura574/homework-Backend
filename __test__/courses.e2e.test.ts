import request from 'supertest'
import {app, routerPaths} from '../src/settings';
import {CoursesTestManager} from '../src/utils/coursesTestManager';
import {CreateCourseModel} from '../src/models/courseModel';

const dataCreateCourse: CreateCourseModel = {
    title: 'new course'
}

describe('/course', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })


    it('should return empty array ', async () => {
        await request(app)
            .get(`${routerPaths.courses}/all`)
            .expect([])
    })


    it('should create new course', async () => {
        const {createdCourse} = await CoursesTestManager.createCourse(dataCreateCourse)
        await CoursesTestManager.getCourse(createdCourse.id)
    })
    it(`shouldn't create new course`, async () => {
        await request(app)
            .post(routerPaths.courses)
            .send({title: 12})
            .expect(400, [
                {
                    "field": "Course",
                    "message": "Course title incorrect"
                }
            ])

    })
    it(`should title was changed`, async () => {
        const {createdCourse} = await CoursesTestManager.createCourse(dataCreateCourse)
        if (createdCourse) {
            await request(app)
                .put(`${routerPaths.courses}/${createdCourse.id}`)
                .send({title: 'new title', studentCount: 12})
                .expect(204)
      await  CoursesTestManager.getCourse(createdCourse.id)

        }


    })
    it(`data course shouldn't be changed`, async () => {
        const {createdCourse} = await CoursesTestManager.createCourse(dataCreateCourse)
        if (createdCourse) {
            const id = createdCourse.id
            await request(app)
                .put(`${routerPaths.courses}/${id}`)
                .send({title: true, studentCount: 10})
                .expect([{field: 'Course', message: 'Course title incorrect'}])

            await request(app)
                .put(`${routerPaths.courses}/${id}`)
                .send({title: 'sdds', studentCount: '33g'})
                .expect(400, [{field: 'Student count', message: 'Student count incorrect'}])
            await request(app)
                .put(`${routerPaths.courses}/${id}`)
                .send({title: true, studentCount: 'true'})
                .expect([
                    {field: 'Course', message: 'Course title incorrect'},
                    {field: 'Student count', message: 'Student count incorrect'}
                ])

        }

    })
    it('course should be deleted', async () => {
        const {createdCourse} = await CoursesTestManager.createCourse(dataCreateCourse)
     await CoursesTestManager.deleteCourse(createdCourse.id)
    })


})