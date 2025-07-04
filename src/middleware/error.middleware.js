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
        console.log('There was an error', error)
        response.status(500).json(
            {
                message: 'Internal server error',
                ok: false
            }
        )
    }
}
export default errorMiddleware