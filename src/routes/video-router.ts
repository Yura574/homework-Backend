import express, {Request, Response} from 'express';


export const videoRouter = express.Router({})


const AvailableResolutionsType = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

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
    availableResolutions: typeof AvailableResolutionsType
}


export let videos: VideoType [] = [
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
    res.status(200).send(videos)
})
videoRouter.get('/:id', (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(404).send('video not found')
    }
})
type RequestWithBody<P, B> = Request<P, unknown, B, unknown>
type CreateVideoType = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutionsType
}
type ParamIdType = {
    id: string
}
type ErrorMessageType = {
    field: string
    message: string
}
type ErrorType = {
    errorsMessages: ErrorMessageType[]
}
videoRouter.post('/', (req: RequestWithBody<ParamIdType, CreateVideoType>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body
    if (!title || !title.trim() || typeof title !== 'string' || title.trim().length > 40) {
        errors.errorsMessages.push({field: 'title', message: 'title incorrect'})
    }
    if (!author || !author.trim() || typeof author !== 'string' || author.trim().length > 20) {
        errors.errorsMessages.push({field: 'author', message: 'author incorrect'})
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutionsType.includes(r)) {
                errors.errorsMessages.push({message: 'Available resolutions incorrect', field: 'availableResolutions'})
                return
            }
        })
    } else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length > 0) {
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date(createdAt);
    publicationDate.setDate(createdAt.getDate() + 1);

    const newVideo: VideoType = {
        id: +(new Date()),
        title,
        author,
        availableResolutions,
        createdAt: createdAt.toISOString(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: publicationDate.toISOString()

    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
    return;


})

videoRouter.delete('/:id', (req: Request, res: Response) => {
    const index = videos.findIndex(v => v.id === +req.params.id)
    if (index >= 0) {
        videos.splice(index, 1)
        res.send(204)
        return
    }
    res.send(404)
    return;

})

type VideoUpdateType = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutionsType
    canBeDownloaded: boolean
    minAgeRestriction: any
    publicationDate: string
}
videoRouter.put('/:id', (req: RequestWithBody<ParamIdType, VideoUpdateType>, res: Response) => {
    const {title, author, availableResolutions, publicationDate, minAgeRestriction, canBeDownloaded} = req.body
    const fieldError: ErrorType = {
        errorsMessages: []
    }
    if (!title || !title.trim() || title.length > 40) {
        fieldError.errorsMessages.push({field: 'title', message: 'Incorrect title'})
    }

    if (!author || !author.trim() || author.length > 20) {
        fieldError.errorsMessages.push({field: 'title', message: 'Incorrect author'})
    }
    if(typeof canBeDownloaded !== 'boolean'){
        fieldError.errorsMessages.push({field: 'canBeDownloaded', message: 'Incorrect canBeDownloaded'})
    }
    if(+minAgeRestriction < 1 || +minAgeRestriction > 18 || !+minAgeRestriction){
        fieldError.errorsMessages.push({field: 'minAgeRestriction', message: 'Incorrect minAgeRestriction'})
    }

    if (fieldError.errorsMessages.length > 0) {
        res.status(400).send(fieldError)
        return;
    }

    const video = videos.find(v => v.id === +req.params.id)

    if (!video) {
        res.send(404)
        return;
    }

    let newVideo: VideoType = {
        id: video.id,
        author: author,
        title: title,
        availableResolutions: availableResolutions ? availableResolutions : video.availableResolutions,
        createdAt: video.createdAt,
        canBeDownloaded: canBeDownloaded ? canBeDownloaded : video.canBeDownloaded,
        minAgeRestriction: minAgeRestriction ? minAgeRestriction : video.minAgeRestriction,
        publicationDate: publicationDate ? publicationDate : video.publicationDate
    }
    const index = videos.findIndex(v => v.id === video.id)

    videos.splice(index, 1, newVideo)


    res.send(204)
    return
})

