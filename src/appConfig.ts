import {config} from "dotenv";


config()


export const appConfig = {
  MONGO_URL : process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
}
