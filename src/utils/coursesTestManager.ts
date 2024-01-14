import {CreateCourseModel} from '../models/courseModel';
import request from 'supertest';
import {app} from '../settings';
import {HTTP_STATUSES, HttpStatusType} from './httpStatuses';


export const CoursesTestManager = {
    async createCourse (data: CreateCourseModel, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201){
        const res = await request(app)
            .post('/courses')
            .send(data)
            .expect(statusCode)
        let createdCourse
        if(statusCode === HTTP_STATUSES.CREATED_201){
            createdCourse = res.body
            expect(createdCourse).toEqual({
                id: expect.any(Number),
                title: data.title,
                studentCount: 10
            })
        }
        return {res, createdCourse}
    },
    async getCourse (id: number, statusCode: HttpStatusType = HTTP_STATUSES.OK_200){
         await request(app)
            .get(`/courses/${id}`)
             .expect(statusCode)
    },
    async deleteCourse (id: number, statusCode: HttpStatusType = HTTP_STATUSES.CHANGE_204){
        await request(app)
            .delete(`/courses/${id}`)
            .expect(statusCode)
    }
}