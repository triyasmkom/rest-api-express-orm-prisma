const request = require('supertest')

const app = require('./server')

afterAll((done)=>{
    done()
})


describe('api-public', function () {
    test('test with response code', async function () {
        const res = await request(app).get('/api/public/')
        expect(res.status).toBe(200)
    });

    test('test with body', async function () {
        const res = await request(app).get('/api/public/')
        expect(res.body.message).toBe('Awesome it works 🐻')
    });
});

