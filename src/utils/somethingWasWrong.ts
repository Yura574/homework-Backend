import {ObjectResult, ResultStatus} from "./objectResult";


export const somethingWasWrong: ObjectResult = {
    status: ResultStatus.SomethingWasWrong,
    errorsMessages: 'Something was wrong',
    data: null
}