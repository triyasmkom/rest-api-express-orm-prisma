const {Router} = require('express')

const publicController = (db)=>{
  PublicController = Router();
  // Endpoint for get all products
  PublicController.get('/', async (req, res, next) => {
    res.send({ message: 'Awesome it works 🐻' });
  });

  // PublicController.use('/api', require('./routes/api.route'));
  return PublicController;
}

module.exports = publicController;
