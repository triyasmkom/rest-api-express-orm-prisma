const productService = require("../service/product.service");
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
const s$product = productService(db)

describe('Sample Test', function () {
    it('true',()=>{
        expect(true).toBe(true)
    })
});

describe('Jumlah', function () {
    test('Benar', async ()=>{
        const result = await s$product.penjumlahan(5, 7)
        expect(result).toBe(12)
    })

    test('Salah', async ()=>{
        const s$product = productService(db)
        const result = await s$product.penjumlahan(5, 7)
        expect(result!==12).toBe(false)
    })
});

describe('Uji DB', ()=>{
    test('Add Product - Gagal', async ()=>{
        const req = {
            body:{
                "name": "Iphone 1035",
                "price": 12000000,
                "categoryId": 1
            }
        }

        const addProduct = await s$product.addProduct(req);
        const result = await s$product.addProduct(req);

        await s$product.deleteProduct({
            params:{
                id: addProduct.data.product.id
            }
        })

        expect(result.status).toBe('Unique')
    })

    test('Add Product - Sukses', async ()=>{
        const req = {
            body:{
                "name": "Iphone 1035",
                "price": 12000000,
                "categoryId": 1
            }
        }
        const result = await s$product.addProduct(req)

        await s$product.deleteProduct({
            params:{
                id: result.data.product.id
            }
        })

        expect(result.code).toBe(200)

    })



    test('Test Product - All', async ()=>{
        const req = {
            body:{
                "name": "Iphone 1035",
                "price": 12000000,
                "categoryId": 1
            }
        }

        const addProduct = await s$product.addProduct(req);

        expect(addProduct.code).toBe(200)

        const result = await s$product.addProduct(req);

        expect(result.status).toBe('Unique')

        const deleteP = await s$product.deleteProduct({
            params:{
                id: addProduct.data.product.id
            }
        })

        expect(deleteP.code).toBe(200)
    })
})
