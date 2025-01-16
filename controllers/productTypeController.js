const { ProductType } = require('../models'); // Import the ProductType model
const Sequelize = require('sequelize');

exports.createProductType = async (req, res) => {
  const loggedInUserRoleId = req.user.client_id; 
  
  const { product_type, description, activeStatus } = req.body;

  try {
    const existingProductType = await ProductType.findOne({
      where: { product_type, role_id: loggedInUserRoleId },
    });

    if (existingProductType) {
      return res.status(400).json({
        success: false,
        message: 'Product type already exists for this role.',
      });
    }

    const active_status = activeStatus === 'true' || activeStatus === true ? 1 : 0;

    const newProductType = await ProductType.create({
      role_id: loggedInUserRoleId,
      product_type,
      description,
      active_status, 
    });

    // Format the response data
    const responseData = {
      product_type: newProductType.product_type,
      role_id: newProductType.role_id,
      description: newProductType.description,
      active_status: newProductType.active_status, 
    };

    return res.status(201).json({
      success: true,
      message: 'Product type created successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the product type.',
    });
  }
};

exports.getProductTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const productType = await ProductType.findOne({
      where: { id: id },
    });

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: productType,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the product type.',
    });
  }
};

exports.updateProductTypeById = async (req, res) => {
    const { id } = req.params;
    const { product_type, description, activeStatus } = req.body;
  
    try {
      // Find the existing product type by ID
      const existingProductType = await ProductType.findOne({
        where: { id: id },
      });
  
      if (!existingProductType) {
        return res.status(404).json({
          success: false,
          message: 'Product type not found.',
        });
      }
  
      // Check if another product type with the same name exists for the same role_id
      const duplicateProductType = await ProductType.findOne({
        where: {
          product_type: product_type,
          role_id: existingProductType.role_id,
          id: { [Sequelize.Op.ne]: id }, // Exclude the current product type
        },
      });
  
      if (duplicateProductType) {
        return res.status(400).json({
          success: false,
          message: 'Product type already exists for this role.',
        });
      }
  
      // Set active_status based on activeStatus (true/false or 'true'/'false')
      const active_status = activeStatus === 'true' || activeStatus === true ? 1 : 0;
  
      // Perform the update
      const updatedProductType = await ProductType.update(
        { product_type, description, active_status }, // Include active_status in the update
        { where: { id: id } }
      );
  
      if (updatedProductType[0] === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product type not found.',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Product type updated successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the product type.',
      });
    }
  };
  

// Delete product type by ID
exports.deleteProductTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProductType = await ProductType.destroy({
      where: { id: id },
    });

    if (deletedProductType === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product type deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the product type.',
    });
  }
};

// Get all product types based on logged-in user's role
exports.getAllProductTypes = async (req, res) => {
  const loggedInUserRoleId = req.user.client_id;

  try {
    if (loggedInUserRoleId === 1) {
      const productTypes = await ProductType.findAll();
      return res.status(200).json({
        success: true,
        data: productTypes,
      });
    }

    const productTypes = await ProductType.findAll({
      where: { role_id: loggedInUserRoleId },
    });

    if (productTypes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No product types found for this role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: productTypes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the product types.',
    });
  }
};
