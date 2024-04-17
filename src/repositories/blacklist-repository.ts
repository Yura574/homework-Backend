// import {blacklistTokenCollection} from "../db/db";
//
//
// export class BlacklistRepository {
//     static async addToken (token: string){
//         await blacklistTokenCollection.insertOne({token})
//         return
//     }
//
//     static async findToken(token: string){
//        return  await blacklistTokenCollection.findOne({token})
//     }
//
//     static async deleteToken(token: string){
//         return await blacklistTokenCollection.deleteOne({token})
//     }
// }