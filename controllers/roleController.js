const { Roles } = require('../models');
const Sequelize = require('sequelize');

// Create a new role
exports.createRoles = async (req, res) => {
  const { roleName, department, description } = req.body;

  const loggedInUserRoleId = req.user.client_id;

  try {
    // Check if roleName already exists
    const existingRole = await Roles.findOne({
      where: { role_name: roleName }
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role name already exists.',
      });
    }

    // Create the new role
    const newRole = await Roles.create({
      role_name: roleName,
      role_id: loggedInUserRoleId,
      department,
      description,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Prepare response data
    const responseData = {
      roleName: newRole.role_name,
      role_id: newRole.role_id,
      department: newRole.department,
      description: newRole.description,
    };

    return res.status(201).json({
      success: true,
      message: 'Role created successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the role.',
    });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Roles.findOne({
      where: { id: id },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the role.',
    });
  }
};

// Update role by ID
exports.updateRoleById = async (req, res) => {
  const { id } = req.params;
  const { roleName, department, description } = req.body;

  try {
    // Check if roleName already exists (excluding the current role)
    const existingRole = await Roles.findOne({
      where: {
        role_name: roleName,
        id: { [Sequelize.Op.ne]: id }, // Exclude the current role ID
      }
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role name already exists.',
      });
    }

    const updatedRole = await Roles.update(
      { 
        role_name: roleName, 
        department, 
        description,
        updated_at: new Date(),  // Ensure updated_at is set
      },
      { where: { id: id } }
    );

    if (updatedRole[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the role.',
    });
  }
};

// Delete role by ID
exports.deleteRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRole = await Roles.destroy({
      where: { role_id: id },
    });

    if (deletedRole === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the role.',
    });
  }
};

// Get all roles based on logged-in user's role
exports.getAllRoles = async (req, res) => {
  const loggedInUserRoleId = req.user.role_id; // Get the role ID of the logged-in user

  try {
    // If the logged-in user is an admin (role_id = 1), fetch all roles
    if (loggedInUserRoleId === 1) {
      const roles = await Roles.findAll();
      
      return res.status(200).json({
        success: true,
        data: roles,
      });
    }
    
    // If the logged-in user is not an admin, fetch only roles that match the logged-in user's role_id
    const roles = await Roles.findAll({
      where: { role_id: loggedInUserRoleId }, // Filter roles by the logged-in user's role_id
    });

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No roles found for this role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching roles.',
    });
  }
};
