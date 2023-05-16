const {Router} = require('express')
const productService = require('./../service/product.service')
const utils = require('./../utils/response')
const productController = (db)=>{

  const s$product = productService(db)
  ProductController = Router();


  // Endpoint for get all products
  ProductController.get('/', async (req, res, next) => {
    const data = await s$product.getProduct(req)
    utils.sendResponse(res, data)
  });

// Endpoint for get products by id
  ProductController.get('/:id', async (req, res, next) => {
    const data = await s$product.getProductById(req)
    utils.sendResponse(res, data)
  });

// Endpoint for create new products
  ProductController.post('/', async (req, res, next) => {
    const data = await s$product.addProduct(req)
    utils.sendResponse(res, data)
  });

// Endpoint for delete products by id
  ProductController.delete('/:id', async (req, res, next) => {
    const data = await s$product.deleteProduct(req)
    utils.sendResponse(res, data)
  });

// Endpoint for update products by id
  ProductController.patch('/:id', async (req, res, next) => {
    const data = await s$product.updateProduct(req)
    utils.sendResponse(res, data)
  });

  return ProductController;
}

module.exports = productController;
