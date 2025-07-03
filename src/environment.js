// Como el type de nuestro proyecto en package.json es commonjs, no podemos usar import/export - usamos dotenv
// const dotenv = require('dotenv')

// Como el type de nuestro proyecto es module, si podemos usar import/export
import dotenv from 'dotenv' // import default
// import {config} from 'dotenv' // import normal and specifically bring the method config

// Esto carga las variables de entorno en la variable process.env
// require above is a native function in nodejs that allow you to import modules, JSON & files
dotenv.config()

export const ENVIRONMENT ={
    API_KEY: process.env.API_KEY,
    GMAIL: process.env.GMAIL,
    DB_URL: process.env.DB_URL,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DB_MONGO_PASSWORD: process.env.DB_MONGO_PASSWORD
}
