const express = require('express');
const locationController = require('../controllers/locationController'); // Update path if necessary
const router = express.Router();
const { authMiddleware, isAdmin, setClientRole } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, setClientRole, locationController.createLocation);

router.get('/:id', locationController.getLocationById);

router.put('/:id', locationController.updateLocationById);

router.delete('/:id', locationController.deleteLocationById);

router.get('/', authMiddleware, setClientRole, locationController.getAllLocations);

module.exports = router;
