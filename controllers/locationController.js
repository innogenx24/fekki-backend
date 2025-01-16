const { Location } = require('../models'); // Assuming the Location model is imported
const Sequelize = require('sequelize');

// Create a new location
exports.createLocation = async (req, res) => {
    const { country, state, city, activeStatus } = req.body; // activeStatus coming as a boolean (true/false)
    const loggedInUserRoleId = req.user.client_id || 1;
      
    try {
      // Check if the location already exists for the given role
      const existingLocation = await Location.findOne({
        where: { country, state, city, role_id: loggedInUserRoleId },
      });
  
      if (existingLocation) {
        return res.status(400).json({
          success: false,
          message: 'Location already exists for this role.',
        });
      }
  
      // Convert activeStatus to integer (1 or 0)
      const activeStatusInt = activeStatus ? 1 : 0;
  
      const newLocation = await Location.create({
        role_id: loggedInUserRoleId,
        country,
        state,
        city,
        active_status: activeStatusInt,  // Ensure we store 1 or 0
      });
  
      const responseData = {
        country: newLocation.country,
        state: newLocation.state,
        city: newLocation.city,
        active_status: newLocation.active_status,
        role_id: loggedInUserRoleId,
      };
  
      return res.status(201).json({
        success: true,
        message: 'Location created successfully.',
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating the location.',
      });
    }
  };

// Get location by ID
exports.getLocationById = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findOne({
      where: { id: id },
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the location.',
    });
  }
};

// Update location by ID
exports.updateLocationById = async (req, res) => {
    const { id } = req.params;
    const { country, state, city, activeStatus } = req.body;
  
    try {
      // Find the existing location to compare with the new data
      const existingLocation = await Location.findOne({
        where: { id: id },
      });
  
      if (!existingLocation) {
        return res.status(404).json({
          success: false,
          message: 'Location not found.',
        });
      }
  
      // Check if a location with the same country, state, and city already exists (excluding the current location)
      const locationExists = await Location.findOne({
        where: {
          country,
          state,
          city,
          role_id: existingLocation.role_id,  // Ensure the check is done for the same role_id
          id: { [Sequelize.Op.ne]: id },  // Exclude the current location being updated
        },
      });
  
      if (locationExists) {
        return res.status(400).json({
          success: false,
          message: 'Location already exists with the same country, state, and city.',
        });
      }
  
      // Perform the update if location doesn't already exist
      const updatedLocation = await Location.update(
        { 
          country, 
          state, 
          city, 
          active_status: activeStatus ? 1 : 0 
        },
        { where: { id: id } }
      );
  
      if (updatedLocation[0] === 0) {
        return res.status(404).json({
          success: false,
          message: 'Location not found.',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Location updated successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the location.',
      });
    }
  };
  

// Delete location by ID
exports.deleteLocationById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLocation = await Location.destroy({
      where: { id: id },
    });

    if (deletedLocation === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Location deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the location.',
    });
  }
};

// Get all locations based on logged-in user's role
exports.getAllLocations = async (req, res) => {
  const loggedInUserRoleId = req.user.role_id;

  try {
    // Fetch all locations if the user is an admin (role_id = 1)
    if (loggedInUserRoleId === 1) {
      const locations = await Location.findAll();

      return res.status(200).json({
        success: true,
        data: locations,
      });
    }

    // Fetch only locations associated with the logged-in user's role
    const locations = await Location.findAll({
      where: { role_id: loggedInUserRoleId },
    });

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No locations found for this role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the locations.',
    });
  }
};
