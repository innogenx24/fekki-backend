const express = require('express');
const roleController = require('../controllers/roleController');
const router = express.Router();
const { authMiddleware,isAdmin,setClientRole } = require('../middlewares/authMiddleware'); 


router.post('/create',authMiddleware, setClientRole, roleController.createRoles );

router.get('/:id', roleController.getRoleById);

router.put('/:id', roleController.updateRoleById);

router.delete('/:id', roleController.deleteRoleById);

router.get('/',authMiddleware, setClientRole, roleController.getAllRoles);

module.exports = router;
