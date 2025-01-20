const { Category } = require('../models'); // Update the import to Category model
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.createCategory = async (req, res) => {
    const { category, description } = req.body;
    const loggedInUserRoleId = req.user.client_id;
  
    try {
      // Check if the category already exists
      const existingCategory = await Category.findOne({
        where: { category, role_id: loggedInUserRoleId },
      });
  
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category already exists for this role.',
        });
      }
  
      const newCategory = await Category.create({
        role_id: loggedInUserRoleId,
        category,
        description,
      });
  
      const responseData = {
        category: newCategory.category,
        role_id: newCategory.role_id,
        description: newCategory.description,
      };
  
      return res.status(201).json({
        success: true,
        message: 'Category created successfully.',
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating the category.',
      });
    }
  };


// Get category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({
      where: { id: id }, // Use 'id' as the primary key
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the category.',
    });
  }
};

// Update category by ID with timestamp check
exports.updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const { category, description } = req.body;

  try {
    // Find the existing category to compare with the new data
    const existingCategory = await Category.findOne({
      where: { id: id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const existingCategory1 = await Category.findOne({
         where: {
           [Op.or]: [
             { category: category },
           ],
         },
       });
   
       if (existingCategory1) {
         if (existingCategory1.category === category) {
           return res.status(400).json({
             success: false,
             message: 'Category already exists for this role.',
           });
         }
       }

    // Perform the update
    const updatedCategory = await Category.update(
      { category, description },
      { where: { id: id } }
    );

    if (updatedCategory[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the category.',
    });
  }
};

// Delete category by ID
exports.deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.destroy({
      where: { id: id },
    });

    if (deletedCategory === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the category.',
    });
  }
};

// Get all categories based on logged-in user's role
exports.getAllCategory = async (req, res) => {
  const loggedInUserRoleId = req.user.role_id; // Get the role ID from the logged-in user

  try {
    // If the logged-in user is an admin (role_id = 1), fetch all categories
    if (loggedInUserRoleId === 1) {
      const categories = await Category.findAll();
      
      return res.status(200).json({
        success: true,
        data: categories,
      });
    }
    
    // If the logged-in user is not an admin, fetch only categories that match the logged-in user's role_id
    const categories = await Category.findAll({
      where: { role_id: loggedInUserRoleId }, // Filter categories by role_id
    });

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No categories found for this role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the categories.',
    });
  }
};
