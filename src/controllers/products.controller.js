import productsRepository from "../repositories/products.repository.js"

//Recibir datos de consulta y emitir respuestas
class ProductController {
    create (request, response){
        console.log("Body:", request.body)
        productsRepository.create({
            title: request.body.title, 
            price: request.body.price, 
        })

        response.send({
            message: 'Recibido!!', 
            ok: true
        })
    }
    getAll (request, response){
        const products = productsRepository.getAll();
        response.send({
            ok: true,
            products: products
        })
    }
}

const productsController = new ProductController()
export default productsController