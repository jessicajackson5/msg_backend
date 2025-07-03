const errorMiddleware = (error, request, response, next) => {
    console.error(error)
    if (error.status) {
        response.status(error.status).json(
            {
                message: error.message,
                status: error.status,
                ok: false
            }
        )
        return
    }
    else {
        console.log('Hubo un error', error)
        response.status(500).json(
            {
                message: 'Error interno del servidor',
                ok: false
            }
        )
    }
}
export default errorMiddleware