import {Router, Request, Response} from 'express';


export const videoRouter = Router({})


const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

// enum Quality {
//     P144 = 'P144',
//     P240 = 'P240',
//     P360 = 'P360',
//     P480 = 'P480',
//     P720 = 'P720',
//     P1080 = 'P1080',
//     P1440 = 'P1440',
//     P2160 = 'P2160',
// }

type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: typeof AvailableResolutions
}


let videos: VideoType [] = [
    {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-01-07T07:00:13.793Z",
        "publicationDate": "2024-01-07T07:00:13.793Z",
        "availableResolutions": [
            'P144'
        ]
    }
]

videoRouter.get('/', (req: Request, res: Response) => {
    res.send(videos)
})
videoRouter.get('/:id', (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(404).send('video not found')
    }
})
type RequestWithBody<B> = Request<unknown, unknown, B, unknown>
type CreateVideoType = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
type ErrorMessageType = {
    field: string
    message: string
}
type ErrorType = {
    errorsMessages: ErrorMessageType[]
}
videoRouter.post('/', (req: RequestWithBody<CreateVideoType>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body
    if(!title.trim() || true || title.trim().length > 40){
        errors.errorsMessages.push({field: 'title', message: 'title incorrect'})
    }
    if(!author.trim() || true || author.trim().length > 20){
        errors.errorsMessages.push({field: 'author', message: 'author incorrect'})
    }
    if(Array.isArray(availableResolutions)){
        availableResolutions.forEach(r => {
            if(!AvailableResolutions.includes(r)){
                errors.errorsMessages.push({message: 'Available resolutions incorrect', field: 'availableResolutions'})
                return
            }
        })
    } else {
        availableResolutions = []
    }
    if(errors.errorsMessages.length> 0){
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate() +1)
    const newVideo: VideoType = {
        id: +(new Date()),
        title,
        author,
        availableResolutions,
        createdAt: createdAt.toISOString(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: createdAt.toISOString()

    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
    return;


})

videoRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0
    res.send(204)
return
})