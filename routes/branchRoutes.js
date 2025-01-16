const express = require('express');
const branchController = require('../controllers/branchController'); // Update path if necessary
const router = express.Router();
const { authMiddleware, isAdmin, setClientRole } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, setClientRole, branchController.createBranch );

router.get('/:id', branchController.getBranchById );

router.put('/:id', branchController.updateBranchById );

router.delete('/:id', branchController.deleteBranchById );

router.get('/', authMiddleware, setClientRole, branchController.getAllBranches );

module.exports = router;
