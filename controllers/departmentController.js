const { Department } = require('../models'); // Update the import to Department model
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

// Create a new department
exports.createDepartment = async (req, res) => {
  const { department, description } = req.body;
  const loggedInUserRoleId = req.user.client_id || 1;
  
  try {


    const existingDepartment = await Department.findOne({
      where: {
        [Op.or]: [
          { department: department },
        ],
      },
    });

    if (existingDepartment) {
      if (existingDepartment.department === department) {
        return res.status(400).json({
          success: false,
          message: 'Department Name is already exists.',
        });
      }
    }


    const newDepartment = await Department.create({
      role_id: loggedInUserRoleId,
      department,
      description,
    });



    const responseData = {
      deportment: newDepartment.department,
      role_id: newDepartment.role_id,
      description: newDepartment.description,
    };

    return res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the department.',
    });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findOne({
      where: { id: id }, // Use 'id' as the primary key
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the department.',
    });
  }
};

// Update department by ID
exports.updateDepartmentById = async (req, res) => {
  const { id } = req.params;
  const { roleName, department, description } = req.body;

  try {
    const updatedDepartment = await Department.update(
      { department, description },
      { where: { id: id } }
    );

    if (updatedDepartment[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    const existingDepartment = await Department.findOne({
      where: {
        [Op.or]: [
          { department: department },
        ],
      },
    });

    if (existingDepartment) {
      if (existingDepartment.department === department) {
        return res.status(400).json({
          success: false,
          message: 'Department Name is already exists.',
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the department.',
    });
  }
};

// Delete department by ID
exports.deleteDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDepartment = await Department.destroy({
      where: { id: id },
    });

    if (deletedDepartment === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the department.',
    });
  }
};

// Get all departments based on logged-in user's role
exports.getAllDepartment = async (req, res) => {
  const loggedInUserRoleId = req.user.role_id; // Get the role ID from the logged-in user

  try {
    // If the logged-in user is an admin (role_id = 1), fetch all departments
    if (loggedInUserRoleId === 1) {
      const departments = await Department.findAll();
      
      return res.status(200).json({
        success: true,
        data: departments,
      });
    }
    
    // If the logged-in user is not an admin, fetch only departments that match the logged-in user's role_id
    const departments = await Department.findAll({
      where: { role_id: loggedInUserRoleId }, // Filter departments by role_id
    });

    if (departments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No departments found for this role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the departments.',
    });
  }
};
