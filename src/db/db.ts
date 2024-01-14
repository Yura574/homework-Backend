import {BlogViewModelType} from '../models/blogModels';

export type  UserType = {
    id: number
    userName: string
}
export type CourseType = {
    id: number
    title: string
    studentCount: number
}

export type StudentBindingType = {
    studentId: number
    coursedId: number
    date: Date
}

export type DBType = {
    courses: CourseType[]
    users: UserType[]
    studentCourseBindings: StudentBindingType[]
    blogs: BlogViewModelType[]
}
export const db: DBType = {
    courses: [
        {id: 1, title: 'front-end', studentCount: 10},
        {id: 2, title: 'back-end', studentCount: 10},
        {id: 3, title: 'qa', studentCount: 10},
        {id: 4, title: 'devops', studentCount: 10},
    ],
    users: [
        {id: 1, userName: 'Dima'},
        {id: 2, userName: 'Vanya'},
    ],
    studentCourseBindings: [
        {studentId: 1, coursedId: 1, date: new Date(2022, 10, 1)},
        {studentId: 1, coursedId: 2, date: new Date(2022, 10, 1)},
        {studentId: 2, coursedId: 2, date: new Date(2022, 10, 1)},
    ],
    blogs: [
        {
            id: '12', name: 'as', websiteUrl: 'asas', description:'asas'
        }
    ]
}