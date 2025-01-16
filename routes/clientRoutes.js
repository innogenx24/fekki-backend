const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const upload = require('../middlewares/multer');
const { authMiddleware, isAdmin,setClientRole } = require('../middlewares/authMiddleware'); 
router.post('/create',authMiddleware, isAdmin , upload.fields([{ name: 'image', maxCount: 1 }]), clientController.createClient);

router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }]), clientController.updateClient );
router.get('/:id',authMiddleware ,setClientRole, clientController.getClientById );
router.get('/',authMiddleware, isAdmin , clientController.getAllClients );

router.patch('/:id/status', clientController.updateClientStatus);

router.delete('/:id', clientController.deleteClient  ); 

module.exports = router;
