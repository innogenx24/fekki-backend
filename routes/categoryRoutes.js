const express = require('express');
const categoryController = require('../controllers/categoryController'); // Update path if necessary
const router = express.Router();
const { authMiddleware, isAdmin, setClientRole } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, setClientRole, categoryController.createCategory );

router.get('/:id', categoryController.getCategoryById );

router.put('/:id', categoryController.updateCategoryById );

router.delete('/:id', categoryController.deleteCategoryById );

router.get('/', authMiddleware, setClientRole, categoryController.getAllCategory );

module.exports = router;
