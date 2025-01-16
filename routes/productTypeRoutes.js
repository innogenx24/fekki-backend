const express = require('express');
const productTypeController = require('../controllers/productTypeController'); // Update path if necessary
const router = express.Router();
const { authMiddleware, isAdmin, setClientRole } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, setClientRole, productTypeController.createProductType  );

router.get('/:id', productTypeController.getProductTypeById  );

router.put('/:id', productTypeController.updateProductTypeById  );

router.delete('/:id', productTypeController.deleteProductTypeById  );

router.get('/', authMiddleware, setClientRole, productTypeController.getAllProductTypes  );

module.exports = router;
