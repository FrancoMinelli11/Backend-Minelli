import dotenv from 'dotenv'

dotenv.config()

export const config = {
    URL_DB : process.env.URL_DB,
    PORT: process.env.PORT
}