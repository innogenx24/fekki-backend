const { SubCategory } = require('../models'); // Assuming SubCategory model is used instead of Category
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

// Create SubCategory
exports.createSubCategory = async (req, res) => {
  const { category, sub_category, description } = req.body;
  const loggedInUserRoleId = req.user.client_id;

  try {
    // Check if the sub-category already exists
    const existingSubCategory = await SubCategory.findOne({
      where: {category, sub_category, role_id: loggedInUserRoleId },
    });

    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: 'SubCategory already exists for this role.',
      });
    }

    // Create new subcategory
    const newSubCategory = await SubCategory.create({
      role_id: loggedInUserRoleId,
      category,
      sub_category,
      description,
    });

    const responseData = {
      category: newSubCategory.category,
      sub_category: newSubCategory.sub_category,
      role_id: newSubCategory.role_id,
      description: newSubCategory.description,
    };

    return res.status(201).json({
      success: true,
      message: 'SubCategory created successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the subcategory.',
    });
  }
};

// Get SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findOne({
      where: { id: id }, // Use 'id' as the primary key
    });

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'SubCategory not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the subcategory.',
    });
  }
};

// Update SubCategory by ID with timestamp check
exports.updateSubCategoryById = async (req, res) => {
  const { id } = req.params;
  const { category, sub_category, description } = req.body;

  try {
      // Check if the subcategory exists
      const existingSubCategory = await SubCategory.findOne({ where: { id } });

      if (!existingSubCategory) {
          return res.status(404).json({
              success: false,
              message: 'SubCategory not found.',
          });
      }

      // Check for duplicate category or subcategory
      const existingDepartment = await SubCategory.findOne({
          where: {
              [Op.or]: [
                  { category },
                  { sub_category },
              ],
              id: { [Op.ne]: id }, 
          },
      });

      if (existingDepartment) {
          if (existingDepartment.sub_category === sub_category) {
              return res.status(400).json({
                  success: false,
                  message: 'SubCategory already exists for this role.',
              });
          }
      }

      // Perform the update
      const [rowsUpdated] = await SubCategory.update(
          { category, sub_category, description },
          { where: { id } }
      );

      if (rowsUpdated === 0) {
          return res.status(404).json({
              success: false,
              message: 'SubCategory not found.',
          });
      }

      return res.status(200).json({
          success: true,
          message: 'SubCategory updated successfully.',
      });
  } catch (error) {
      console.error('Error updating subcategory:', error);
      return res.status(500).json({
          success: false,
          message: 'An error occurred while updating the subcategory.',
      });
  }
};
  

// Delete SubCategory by ID
exports.deleteSubCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubCategory = await SubCategory.destroy({
      where: { id: id },
    });

    if (deletedSubCategory === 0) {
      return res.status(404).json({
        success: false,
        message: 'SubCategory not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'SubCategory deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the subcategory.',
    });
  }
};

// Get all SubCategories based on logged-in user's role
exports.getAllSubCategory = async (req, res) => {
  const loggedInUserRoleId = req.user.role_id; // Get the role ID from the logged-in user

  try {
    // If the logged-in user is an admin (role_id = 1), fetch all subcategories
    if (loggedInUserRoleId === 1) {
      const subCategories = await SubCategory.findAll();

      return res.status(200).json({
        success: true,
        data: subCategories,
      });
    }

    // If the logged-in user is not an admin, fetch only subcategories that match the logged-in user's role_id
    const subCategories = await SubCategory.findAll({
      where: { role_id: loggedInUserRoleId }, // Filter subcategories by role_id
    });

    if (subCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No subcategories found for this role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: subCategories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the subcategories.',
    });
  }
};
