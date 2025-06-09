## PUT /api/products Actualizar un producto
Actualizables: title, price,

body:{
    title: "pepe"
    price:
}
Response:
{
    ok: true,
    message; 'Se acutalizo tu produco',
    data: {
        product: {
            title: "pepe",
            price: 50,
            id: 1 
        }
    }
}

Si se envia mal alguna propiedad

Response : {
    ok: false,
    message: 'No se pudo actualizar el producto BAD REQUEST",
    errors: {
        title: {
            text: 'El titulo no tiene mas de 5 carateres'
            code: 3
        }
        price: {
            text: 'El precio debe ser un numero'
            code: 2
        }
    }
}

Response : {
    ok: false,
    message: 'El titulo esta mal escrito',
}