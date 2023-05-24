const express = require('express')
const cors = require('cors')
const routes = require('./../routes/route')

const app = express()
const port = 8000


app.use(cors())
// app.use(express.urlencoded |{extended: true})
app.use(express.json())


routes(app)

app.listen(port, ()=>{
    console.log(`Server On ${port}`)
})

module.exports = app


