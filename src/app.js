// const result = require('./environment.js')
// console.log(result.ENVIRONMENT)
// the above and below are equal
// to desctructure require, you need to return an object e.g., using {OBJECTNAME}
// const {connectDB} = require("./config/db.config.js"); //old specificagtion

//para desestructurar require debe devolver un objeto
import {ENVIRONMENT} from "./environment.js";
import {connectDB} from './config/db.config.js'
import cors from 'cors'
import jwt from 'jsonwebtoken'


connectDB()

import express from 'express'
import authorizationMiddleware from "./middleware/auth.middleware.js";   
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import workspaceRouter from "./routes/workspace.router.js";
//import transporter from "./config/mail.config.js";

const app = express() //Crea una aplicacion de express

//Deshabilita la polica de CORS
app.use(cors())

// Configure app to receive json
app.use(express.json())

//La consulta tipo get no tiene request.body
//Cuando reciba un get en '/' ejecuta la funcion
//La callback asociada a un metodo siempre recibe dos parametros: request y response
//El parametro request es un objeto que contiene toda la informacion de la Consulta
//El parametro response es un objeto que contiene toda la informacion de la Respuesta
//response.send es un metodo que permite enviar una respuesta al cliente
app.get('/', (request, response) => {
    response.send(`<h1>Server is running</h1>`)
})
app.get('/ping', (request, response) => {
    response.send('<h1>Server is running</h1>')
})

app.get('/test-tonto', 
    authorizationMiddleware, 
    ( request, response ) => {
    response.send('Hola')
})
app.get('/private-info', 
    authorizationMiddleware, 
    ( request, response ) => {
        try {
            response.send('Clave super important que solo un USUARIO DEBE ACEDER')
        }
        catch(error){
            response.status(500).send(
                {
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500

                }
            )
        }
    }
)

app.post(
    '/crear-workspace',
    authorizationMiddleware,
    (request, response ) => {
        // quien esta creando el workspace
        // quien va a ser el dueño
        console.log(request.user)
        response.send('Quien quiere crear el workspace es: ' + request.user.id)
        response.send('Workspace creado')
    }
)
// Middleware
// Que es middlewawre? Si lo hemos usado antes, por ejemplo cuando app.use(express.json())
// Entre la consulta y la respuesta quiero checkea si la consulta es de tipo json yde asi guardar en el body el json de la consulta
// Entre la consulta y la respuesta quiero hacer un hola mundo por consola
// Entre la consulta y la respuesta quiero checkear si un token pasado por el header es valido

app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/workspace', workspaceRouter)

// TAREA 6/5 
// Crear un workspace
//  POST '/api/workspace'
// Obtener la lista de workspaces de un usuario
//  GET '/api/workspaces'
// Eliminar un workspace por id (SOLO VALIDO SI EL USUARIO QUE ACE LA CONSULTA ES EL DUENO DEL WORKSPACE)
// DELETE '/api/workspaces/:workspace_id'
app.listen(ENVIRONMENT.PORT, ()=> {
    /*Cuando el servidor se escucha en el puerto 3000 de mi pc se ejecutara esta funcion */
    console.log(`La applicacion se esta escuchando en http://localhost:${ENVIRONMENT.PORT}`)
})

