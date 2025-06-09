const products = [
    { title: 'Tv Samsung', price: 4000, id: 1 },
    { title: 'Tv LG', price: 5000, id: 2 },
    { title: 'Tv Noblex', price: 6000, id: 3 }
]
/* 1. Forma orientada a objectos para crear un product
Creamos una clase de producto

class Product{
    constructor({title, price}){
        this.title = title
        this.price = price
    }
}
Then you can new new Product({title, price})
    */

class ProductsRepository {
    create({title, price}){
        const product = {title, price}
        products.push(product)
        return {
            products: products
        }
    };
    getAll(){
        return {
            products: products,
            ok: true
        }
        // It's a good idea to return an object not just alist to make it more extensible
    }
    //deleteProductByID(id)
}
const productsRepository = new ProductsRepository()
export default productsRepository