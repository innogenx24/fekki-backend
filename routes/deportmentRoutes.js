const express = require('express');
const departmentController = require('../controllers/departmentController'); // Update path if necessary
const router = express.Router();
const { authMiddleware, isAdmin, setClientRole } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, setClientRole, departmentController.createDepartment);

router.get('/:id', departmentController.getDepartmentById);

router.put('/:id', departmentController.updateDepartmentById);

router.delete('/:id', departmentController.deleteDepartmentById);

router.get('/', authMiddleware, setClientRole, departmentController.getAllDepartment);

module.exports = router;
