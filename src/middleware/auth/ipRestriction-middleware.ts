import {NextFunction, Response, Request} from "express";
import {IPRestrictionService} from "../../service/IPRestrictionService";


export const ipRestrictionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allRestrictions = await IPRestrictionService.getIpRestriction(req)
        if (allRestrictions && allRestrictions.length >= 5) {
            const last = allRestrictions?.slice(-5)[0]
            const time = (+new Date() - +new Date(last.date)) / 1000
            if (time < 10) return res.sendStatus(429)
        }
        await IPRestrictionService.addRestriction(req)
    } catch (err) {
        console.log(err)
    }
    return next()
}