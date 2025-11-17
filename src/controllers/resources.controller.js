import * as service from "../services/resources.service.js";    // Importo todas las funciones del service

export const getAllResources = async (req, res) =>
{
    try {
        const resources = await service.getAllResources();
        res.json(resources);
    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({ error: "Error al obtener recursos" });
    }
}

/*
export const getProductById = (req, res) => {
    
    const { id } = req.params;    // desestructuración de objetos.Extraemos el parámetro dinámico 'id' desde la URL
    const product = service.getProductById(id);   // Busca un producto por su id en la URL.

    if(!product)
    {
        return res.status(404).json({error: "Producto no encontrado"});    // Si no lo encuentra, responde con un error 404.
    }
    
    res.json(product);  // Si existe, lo devolvemos
};*/

export const searchResource = async (req, res) => 
{
    const {title} = req.query;   // req.query Se usa para acceder a valores en la URL después del signo de interrogación (?)   
    
    if (!title || typeof title !== 'string' || title.trim() === '')
    {
        return res.status(400).json({ error: "Falta el parámetro 'title' en la query" });
    }
    
    try
    {
        const filteredResources = await service.searchResource(title);     
        
        if(filteredResources.length === 0)
        {
            return res.status(404).json({error: 'Recurso no encontrado'});
        }
        
        return res.json(filteredResources);

    }
    catch(error)
    {
        console.error('searchResource error:', error);
        return res.status(500).json({error: 'Error interno al buscar recursos'});
    }

};


/*


/// ************************************************ RUTAS POST ************************************************


export const createNewProduct = (req, res) =>
{
    const {name, price, cantidad} = req.body;   // req.body contiene los datos enviados por el cliente.

    const newProduct = service.createNewProduct(name, price, cantidad);     // guardamos el nuevo producto que retornó la función para mostrarlo

    if(newProduct.error)
    {
        return res.status(400).json({ error: newProduct.error });
    }

    res.status(201).json(   // código 201. Creado con exito
    {
        mensaje: 'Producto creado con exito',
        producto: newProduct,
    });
}; 



/// ************************************************ RUTAS PUT ************************************************


export const updateProduct = (req, res) =>  // Ruta para modificar el producto
{
    const productId = parseInt(req.params.id, 10);  // Obtengo el id del producto a modificar y lo convierto a entero
    const { name, price, cantidad } = req.body;     // Extraemos los nuevos datos del body de la petición
    const updatedProduct = service.updateProduct(productId, name, price, cantidad);

    if(updatedProduct === -1) // Si no se encuentra, devolvemos error 404
    {
        return res.status(404).json({error: "Producto no encontrado"});
    }

    if(updatedProduct.error)
    {
        return res.status(400).json({ error: updatedProduct.error });
    }

    res.status(200).json(
    {
        mensaje: 'Producto modificado',
        productoModificado: updatedProduct,
    });           // devuelve el producto actualizado
};



/// ************************************************ RUTAS DELETE ************************************************


export const deleteProduct = (req, res) =>   // Ruta para eliminar el producto
{
    const productId = parseInt(req.params.id, 10);  // extraemos el indice a buscar desde la ruta
    const deletedProduct = service.deleteProduct(productId);

    if(deletedProduct == -1)
    {
        return res.status(404).json({error: 'Producto no encontrado'});
    }

    res.status(200).json(
    {
        mensaje: 'Producto eliminado',
        productoEliminado : deletedProduct,
    });    // 204. Es el codigo de estado para la eliminación exitosa, pero como no muestra mensaje, a fines didacticos usé el 200
};

*/