const { Branch } = require('../models'); // Assuming the Branch model is imported
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

// Create a new branch
exports.createBranch = async (req, res) => {
  const { branch_name, country, state, city, address, pincode, activeStatus } = req.body;
  const loggedInUserRoleId = req.user.client_id;

  try {
    // Check if the branch already exists for the given role
    const existingBranch = await Branch.findOne({
      where: { branch_name, role_id: loggedInUserRoleId },
    });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch already exists for this role.',
      });
    }

    // Convert activeStatus to integer (1 or 0)
    const activeStatusInt = activeStatus ? 1 : 0;

    const newBranch = await Branch.create({
      role_id: loggedInUserRoleId,
      branch_name,
      country,
      state,
      city,
      address,
      pincode,
      active_status: activeStatusInt,
    });

    const responseData = {
      branch_name: newBranch.branch_name,
      country: newBranch.country,
      state: newBranch.state,
      city: newBranch.city,
      address: newBranch.address,
      pincode: newBranch.pincode,
      active_status: newBranch.active_status,
      role_id: loggedInUserRoleId,
    };

    return res.status(201).json({
      success: true,
      message: 'Branch created successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the branch.',
    });
  }
};


// Get branch by ID
exports.getBranchById = async (req, res) => {
  const { id } = req.params;

  try {
    const branch = await Branch.findOne({
      where: { id: id },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the branch.',
    });
  }
};

// Update branch by ID
exports.updateBranchById = async (req, res) => {
  const { id } = req.params;
  const { branch_name, country, state, city, address, pincode, activeStatus } = req.body;

  try {
    const existingBranch = await Branch.findOne({
      where: { id: id },
    });

    if (!existingBranch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found.',
      });
    }

    const existingBranch1 = await Branch.findOne({
      where: {
        [Op.or]: [
          { branch_name: branch_name },
        ],
      },
    });

    if (existingBranch1) {
      if (existingBranch1.branch_name === branch_name) {
        return res.status(400).json({
          success: false,
          message: 'Branch name is already exists.',
        });
      }

    }

    // Perform the update
    const updatedBranch = await Branch.update(
      {
        branch_name,
        country,
        state,
        city,
        address,
        pincode,
        active_status: activeStatus ? 1 : 0,
      },
      { where: { id: id } }
    );

    if (updatedBranch[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Branch updated successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the branch.',
    });
  }
};

// Delete branch by ID
exports.deleteBranchById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBranch = await Branch.destroy({
      where: { id: id },
    });

    if (deletedBranch === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Branch deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the branch.',
    });
  }
};

// Get all branches based on logged-in user's role
exports.getAllBranches = async (req, res) => {
  const loggedInUserRoleId = req.user.role_id;

  try {
    // Fetch all branches if the user is an admin (role_id = 1)
    if (loggedInUserRoleId === 1) {
      const branches = await Branch.findAll();

      return res.status(200).json({
        success: true,
        data: branches,
      });
    }

    // Fetch only branches associated with the logged-in user's role
    const branches = await Branch.findAll({
      where: { role_id: loggedInUserRoleId },
    });

    if (branches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No branches found for this role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the branches.',
    });
  }
};
