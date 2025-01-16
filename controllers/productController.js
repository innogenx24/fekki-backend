const { Product } = require('../models');
const { Op } = require('sequelize');

// Create a new product
exports.createProduct = async (req, res) => {
  const {
    productName,
    modelName,
    description,
    productType,
    subProductType,
    isActive,
    category,     
    subCategory,  
  } = req.body;

  try {
    // Check if productName already exists
    const existingProduct = await Product.findOne({ where: { product_name: productName } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with the same name already exists.',
      });
    }

    const productStatus = isActive === 'true' || isActive === true ? 1 : 0;

    const thumbnail = req.files && req.files['thumbnail'] ? req.files['thumbnail'][0].filename : null;
    const fileDetails = req.files && req.files['fileDetails'] ? req.files['fileDetails'][0].filename : null;

    const product = await Product.create({
      product_name: productName,
      model_name: modelName,
      description,
      product_type: productType,
      sub_product_type: subProductType,
      file_details: fileDetails, 
      is_active: productStatus,   
      thumbnail: thumbnail,      
      category,                  
      sub_category: subCategory,
    });

    const responseData = {
      productName: product.product_name,
      modelName: product.model_name,
      description: product.description,
      productType: product.product_type,
      subProductType: product.sub_product_type,
      fileDetails: product.file_details,
      isActive: product.is_active,
      thumbnail: product.thumbnail, 
      category: product.category,    
      subCategory: product.sub_category, 
    };

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the product.',
    });
  }
};



//////GET ID BY PRODUCT DETAILS////////



exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);  // Find product by primary key (ID)

    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // Prepare the response data
    const responseData = {
      id: product.id,
      productName: product.product_name,
      modelName: product.model_name,
      description: product.description,
      productType: product.product_type,
      subProductType: product.sub_product_type,
      fileDetails: product.file_details,
      isActive: product.is_active,
      thumbnail: product.thumbnail, 
      category: product.category,    
      subCategory: product.sub_category, 
      createdAt: product.created_at, 
      updatedAt: product.updated_at, 
    };

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the product.',
    });
  }
};



//////GET ALL PRODUCT DETAILS////////



// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const roleId = req.user.role_id;
    console.log('User Role ID:', roleId); 

    const products = await Product.findAll();

    console.log('Fetched Products:', products);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found.',
      });
    }

    let filteredProducts = products;

    if (roleId === 2) {
      filteredProducts = products.filter(product => product.product_type === 'B2B'); 
      console.log('Filtered Products for Client:', filteredProducts);
    }
    

    // Prepare the response data
    const responseData = filteredProducts.map(product => ({
      id: product.id,
      productName: product.product_name,
      modelName: product.model_name,
      description: product.description,
      productType: product.product_type,
      subProductType: product.sub_product_type,
      fileDetails: product.file_details, 
      isActive: product.is_active,
      thumbnail: product.thumbnail, 
      category: product.category,  
      subCategory: product.sub_category, 
      createdAt: product.created_at, 
      updatedAt: product.updated_at, 
    }));

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching products.',
    });
  }
};


/////PRODUCT ID BASED UPDATED SET


exports.updateProduct = async (req, res) => {
  const { id } = req.params; 
  const {
    productName,
    modelName,
    description,
    productType,
    subProductType,
    isActive,
    category,    
    subCategory, 
  } = req.body;

  try {
    // Check if productName already exists (excluding the current product)
    if (productName) {
      const existingProduct = await Product.findOne({
        where: { product_name: productName, id: { [Op.ne]: id } },
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Another product with the same name already exists.',
        });
      }
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const productStatus = isActive === 'true' || isActive === true ? 1 : 0;

    const thumbnail = req.files && req.files['thumbnail'] ? req.files['thumbnail'][0].filename : null;
    const fileDetails = req.files && req.files['fileDetails'] ? req.files['fileDetails'][0].filename : null;

    const updatedProduct = await product.update({
      product_name: productName || product.product_name,
      model_name: modelName || product.model_name,
      description: description || product.description,
      product_type: productType || product.product_type,
      sub_product_type: subProductType || product.sub_product_type,
      file_details: fileDetails || product.file_details, 
      is_active: productStatus !== undefined ? productStatus : product.is_active,
      thumbnail: thumbnail || product.thumbnail,     
      category: category || product.category,          
      sub_category: subCategory || product.sub_category, 
    });

    const responseData = {
      productName: updatedProduct.product_name,
      modelName: updatedProduct.model_name,
      description: updatedProduct.description,
      productType: updatedProduct.product_type,
      subProductType: updatedProduct.sub_product_type,
      fileDetails: updatedProduct.file_details, 
      isActive: updatedProduct.is_active,
      thumbnail: updatedProduct.thumbnail, 
      category: updatedProduct.category,    
      subCategory: updatedProduct.sub_category, 
    };

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the product.',
    });
  }
};


////////PRODUCT DELETE BY ID /////////////


// Delete an existing product by its ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params; // The product ID from the route parameter

  try {
    // Find the product by ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Delete the product from the database
    await product.destroy();

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the product.',
    });
  }
};


/////UPDATE ACTIVE STATUS////////



exports.UpdateActiveProduct = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    // Convert isActive to a boolean or number (if required)
    const productStatus = isActive === 'true' || isActive === true ? 1 : 0;

    // Find the product by ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Update only the isActive field
    await product.update({
      is_active: productStatus,
    });

    return res.status(200).json({
      success: true,
      message: 'Product active status updated successfully.',
      data: {
        id: product.id,
        isActive: product.is_active,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the active status.',
    });
  }
};
