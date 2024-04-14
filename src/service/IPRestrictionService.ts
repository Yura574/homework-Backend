import {Request} from 'express'
import {IPRestrictionDataModel} from "../models/ipRestrictionModel";
import {IPRestrictionRepository} from "../repositories/ipRestriction-repository";


export class IPRestrictionService {
    static async addRestriction(req: Request) {
        if (!req.ip) return
        const data: IPRestrictionDataModel = {
            IP: req.ip,
            URL: req.originalUrl,
            date: new Date().toISOString(),
        }
        await IPRestrictionRepository.addIpRestriction(data)
    }

    static async getIpRestriction(req: Request) {
        if (!req.ip) return

        return await IPRestrictionRepository.getAllIpRestrictions(req.ip, req.originalUrl)
    }
}