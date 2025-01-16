
const express = require('express');
const consumersController = require('../controllers/consumersController');
const router = express.Router();
const { authMiddleware,isAdmin,setClientRole } = require('../middlewares/authMiddleware'); 


router.post('/create',authMiddleware, setClientRole, consumersController.createConsumer);
router.put('/:id', consumersController.updateConsumer);
router.get('/',authMiddleware, setClientRole, consumersController.getAllConsumers);
router.get('/:id', consumersController.getConsumerById);
router.delete('/:id', consumersController.deleteConsumer);

module.exports = router;
