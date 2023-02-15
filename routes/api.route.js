const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Endpoint for get all products
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {categories: true}
    })

    const categories = await prisma.Category.findMany({
      include:{products: true}
    })
    res.json({products, categories})
  } catch (error) {
    next(error)
  }
});

// Endpoint for get products by id
router.get('/products/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    const product = await prisma.Product.findUnique({
      where:{
        id: Number(id)
      },
      include: {categories:true}
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
});

// Endpoint for create new products
router.post('/products', async (req, res, next) => {
  try {
    const product = await prisma.Product.create({
      data : req.body
    })

    res.json({product})
  } catch (error) {
    next(error)
  }
});

// Endpoint for delete products by id
router.delete('/products/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    const product = await prisma.Product.delete({
      where:{
        id: Number(id)
      }
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
});

// Endpoint for update products by id
router.patch('/products/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    const product = await prisma.Product.update({
      data: req.body,
      where:{
        id: Number(id)
      },
      include: {categories:true}
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
});

module.exports = router;
