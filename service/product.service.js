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

            if (!products){
                return{
                    code: 404,
                    error: 'Sorry, Product Not Found'
                }
            }

            return{
                code: 200,
                status: true,
                data: [products]
            }
        } catch (error) {
            if (debug){
                console.error('Error Get Product', error)
            }
            return {
                code: 500,
                status: false,
                error
            }
        }
    }
    getCategory = async (req)=>{
        try {
            const categories = await this.db.Category.findMany({
                include:{products: true}
            })

            return{
                code: 200,
                status: true,
                data: [categories]
            }
        } catch (error) {
            if (debug){
                console.error('Error Get Product Categories', error)
            }
            return {
                code: 500,
                status: false,
                error
            }
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

            if (!product){
                return{
                    code: 404
                }
            }
            return{
                code: 200,
                status: true,
                data: product
            }
        } catch (error) {
            if (debug){
                console.error('Error Get Product By Id', error)
            }
            return {
                code: 500,
                status: false,
                error
            }
        }
    }

    addProduct = async (req)=>{
        try {
            const {categoryId, name, price, quantity} = req.body

            const product = await this.db.Product.create({
                data: {categoryId, name, price, quantity}
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

            if (error.code === 'P2002') {
                // Error Duplicate
                return {
                    code: 400,
                    status: "Unique",
                    error: 'Sorry, Duplicate name product'
                }
            }

            return {
                code: 500,
                status: false,
                error
            }
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

            if (error.code === 'P2025'){
                return {
                    code: 400,
                    status: false,
                    error: error.meta.cause? `Sorry, ${error.meta.cause }`: `Internal Server`
                }
            }
            return {
                code: 500,
                status: false,
                error
            }
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
                console.error('Error Update Product By Id', error)
            }

            if (error.code === 'P2002') {
                // Error Duplicate
                return {
                    code: 400,
                    status: false,
                    error: error.meta.cause? `Sorry, ${error.meta.cause }`: `Internal Server`
                }
            }
            return {
                code: 500,
                status: false,
                error
            }
        }
    }


    penjumlahan = async (a, b)=>{
        let jumlah
        try{
            jumlah =  a+b
        }catch (error){
            console.log('Error Penjumlahan', error)
        }

        return jumlah
    }


}

module.exports = (db)=> new _product(db)
