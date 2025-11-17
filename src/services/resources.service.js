import * as model from '../models/resources.model.js';

export const getAllResources = () =>
{
    return model.getAllResources();     
}

/*
export const getProductById = (id) => {

    const products = model.readProducts();

    return products.find(product => product.id == id);
}*/


export const searchResource = async (title) =>
{
    const resources = await model.getAllResources();

    return resources.filter((resource) =>
    {
        return resource.title.toLowerCase().includes(title.toLowerCase()); // Devuelve los productos que contengan el texto buscado
    });  
}

/*
export const getProductIndexById = (id) =>
{
    const products = model.readProducts();

    return products.findIndex(product => product.id == id);
}

export const createNewProduct = (name, price, cantidad) =>
{
    if (!name || typeof name !== 'string' || name.trim() === '')
    {
        return { error: 'El nombre es obligatorio y debe ser un texto válido' };
    }

    if (isNaN(price) || price < 1)
    {
        return { error: 'El precio debe ser un número positivo' };
    }

    if (!Number.isInteger(cantidad) || cantidad < 1)
    {
        return { error: 'La cantidad debe ser un número entero positivo' };
    }

    const products = model.readProducts();

    const newProduct = {  // Generamos un nuevo producto con los datos recibidos (name, price, cantidad)
    
        id: products.length + 1,
        name,
        price,
        cantidad,
    };    

    products.push(newProduct);  // Pusheamos el producto en el array de productos
    model.writeProducts(products);  // sobreescribimos la nueva tabla de productos

    return newProduct;
}

export const updateProduct = (productId, name, price, cantidad) =>
{
    if (!name || typeof name !== 'string' || name.trim() === '')
    {
        return { error: 'El nombre es obligatorio y debe ser un texto válido' };
    }

    if (isNaN(price) || price < 1)
    {
        return { error: 'El precio debe ser un número positivo' };
    }

    if (!Number.isInteger(cantidad) || cantidad < 1)
    {
        return { error: 'La cantidad debe ser un número entero positivo' };
    }

    const products = model.readProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if(productIndex === -1) // Si no se encuentra, devolvemos error 404
    {
        return -1;
    }

    // Creamos el nuevo objeto actualizado
    const updatedProduct = {
        id: productId,
        name,
        price,
        cantidad
    };

    products[productIndex] = updatedProduct;    // Modificamos el producto en la lista
    model.writeProducts(products);              // sobreescribimos la nueva tabla de productos

    return updatedProduct;
}

export const deleteProduct = (productId) =>
{
    const products = model.readProducts();
    const productIndex = products.findIndex(p => p.id === productId);


    if(productIndex === -1)     // Si no existe retorna -1
    {
        return -1;
    }

    // Usamos desestructuración con const [deletedProduct] = ... para obtener directamente el objeto eliminado, en lugar de un array.
    const [deletedProduct] = products.splice(productIndex, 1);   // Eliminamos el producto de la lista

    model.writeProducts(products);      // Sobreescribe los datos en la tabla productos

    return deletedProduct;
} 
    
*/