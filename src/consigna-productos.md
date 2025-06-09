# Consigna: Repositorio, Controlador y Rutas para Productos

## Paso 1: Repositorio de Productos

1. Crear un archivo llamado `products.repository.js`.
2. Dentro del archivo, declarar la siguiente variable:

```js
const products = [
    { title: 'Tv Samsung', price: 4000, id: 1 },
    { title: 'Tv LG', price: 5000, id: 2 },
    { title: 'Tv Noblex', price: 6000, id: 3 }
];
```

3. Crear una clase llamada `ProductsRepository` que contenga los siguientes métodos:

- `create(title, price)`:  
  Permite crear un nuevo producto con los datos recibidos.  
  Se debe asignar un nuevo ID de forma incremental.

- `getAll()`:  
  Devuelve la lista completa de productos.

---

## Paso 2: Controlador de Productos

1. Crear una clase llamada `ProductsController` que contenga los siguientes métodos:

- `create(req, res)`:  
  Recibe los datos del producto (`title` y `price`) desde `req.body`, y utiliza el repositorio para crear el nuevo producto.  
  Retorna una respuesta adecuada al cliente.

- `getAll(req, res)`:  
  Utiliza el repositorio para obtener todos los productos y los retorna como respuesta.

---

## Paso 3: Rutas de la API

1. Crear una ruta base para `/api/products`.
2. Implementar las siguientes operaciones HTTP:

- `GET /api/products`:  
  Retorna la lista de todos los productos.

- `POST /api/products`:  
  Permite crear un nuevo producto.  
  El cuerpo del request debe contener un objeto con las propiedades `title` y `price`.

### Ejemplo de body para POST:
```json
{
  "title": "Nuevo producto",
  "price": 3000
}
```