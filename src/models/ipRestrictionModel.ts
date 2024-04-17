import {Schema} from "mongoose";

export type IPRestrictionDataModel = {
    IP: string
    URL: string
    date: string
}


export type IPRestrictionDBModel = {
    IP: string
    URL: string
    date: string
}



export const IpRestrictionSchema = new Schema<IPRestrictionDBModel>({
    date: String,
    URL: String,
    IP: String
})