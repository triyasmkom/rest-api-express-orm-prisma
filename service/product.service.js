const utils = require('./../utils/response')
const debug = process.env.DEBUG

class _product{

    constructor(db) {
        this.db = db;
    }
    getProduct = async (req)=>{
        try {
            const products = await this.db.product.findMany({
                include: {categories: true}
            })

            const categories = await this.db.Category.findMany({
                include:{products: true}
            })

            return{
                code: 200,
                data:{
                    products, categories
                }
            }
        } catch (error) {
            if (debug){
                console.error('Error Get Product', error)
            }
            return utils.errorHandler(error)
        }
    }

    getProductById = async (req)=>{
        try {
            const {id} = req.params
            const product = await this.db.Product.findUnique({
                where:{
                    id: Number(id)
                },
                include: {categories:true}
            })

            return{
                code: 200,
                data:{
                    product
                }
            }
        } catch (error) {
            if (debug){
                console.error('Error Get Product By Id', error)
            }
            return utils.errorHandler(error)
        }
    }

    addProduct = async (req)=>{
        try {
            const {categoryId, name, price, quantity} = req.body

            const product = await this.db.Product.create({
                data: {categoryId, name, price, quantity}
            })

            if(product.code){
                if (debug){
                    console.error('Error Add Product By Id', error)
                }
                return utils.errorHandler(error)
            }

            return{
                code: 200,
                data:{
                    product
                }
            }
        } catch (error) {
            if (debug){
                console.error('Error Add Product By Id', error)
            }
            return utils.errorHandler(error)
        }
    }

    deleteProduct = async (req)=>{
        try {
            const {id} = req.params
            const product = await this.db.Product.delete({
                where:{
                    id: Number(id)
                }
            })
            return{
                code: 200,
                data:{
                    product
                }
            }
        } catch (error) {
            if (debug){
                console.error('Error Add Product By Id', error)
            }
            return utils.errorHandler(error)
        }
    }

    updateProduct = async (req)=>{
        try {
            const {id} = req.params
            const product = await this.db.Product.update({
                data: req.body,
                where:{
                    id: Number(id)
                },
                include: {categories:true}
            })
            return{
                code: 200,
                data:{
                    product
                }
            }
        } catch (error) {
            if (debug){
                console.error('Error Add Product By Id', error)
            }
            return utils.errorHandler(error)
        }
    }


}

module.exports = (db)=> new _product(db)
