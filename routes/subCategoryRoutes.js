const express = require('express');
const subCategoryController = require('../controllers/subCategoryController'); // Update path if necessary
const router = express.Router();
const { authMiddleware, isAdmin, setClientRole } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, setClientRole, subCategoryController.createSubCategory  );

router.get('/:id', subCategoryController.getSubCategoryById  );

router.put('/:id', subCategoryController.updateSubCategoryById  );

router.delete('/:id', subCategoryController.deleteSubCategoryById  );

router.get('/', authMiddleware, setClientRole, subCategoryController.getAllSubCategory  );

module.exports = router;
