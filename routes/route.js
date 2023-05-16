const productController = require('./../controller/product.controller')
const publicController = require('./../controller/public.controller')

const _routes = [
    ['/products',productController],
    ['/public',publicController]
]

const routes = (app, db)=>{
    _routes.forEach((route)=>{
        const [url, controller] = route
        app.use(`/api${url}`, controller(db))
    })
}

module.exports = routes;
