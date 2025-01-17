const { Customer } = require('../models');
const Sequelize = require('sequelize'); // Ensure Sequelize is defined
const { Op } = require('sequelize');

// Create a new customer
exports.createCustomer = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    password,
    roleName,
    department,
    branch,
    emailId,
    phoneNumber,
    pincode,
    country,
    state,
    city,
    landmark,
    street,
    teamHeadId,
    isTeamHead,
    roleBased,
  } = req.body;

  // Retrieve the logged-in user's role_id
  const loggedInUserRoleId = req.user.client_id || 1;

  try {

    const existingCustomer = await Customer.findOne({
      where: {
        [Op.or]: [
          { email_id: emailId },
          { phone_number: phoneNumber },
        ],
      },
    });

    if (existingCustomer) {
      if (existingCustomer.email_id === emailId) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists.',
        });
      }
      if (existingCustomer.phone_number === phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists.',
        });
      }
    }

    const teamHeadStatus = isTeamHead === 'true' || isTeamHead === true ? 1 : 0;
    const roleBasedStatus = roleBased === 'true' || roleBased === true ? 1 : 0;

    const customer = await Customer.create({
      first_name: firstName,
      last_name: lastName,
      username,
      password,  
      role_name: roleName,
      role_id: loggedInUserRoleId,  
      department,
      branch,
      email_id: emailId,
      phone_number: phoneNumber,
      pincode,
      country,
      state,
      city,
      landmark,
      street,
      team_head_id: teamHeadId,
      is_team_head: teamHeadStatus,
      role_based: roleBasedStatus,
    });

    // Prepare the response with customer data
    const responseData = {
      firstName: customer.first_name,
      lastName: customer.last_name,
      username: customer.username,
      roleName: customer.role_name,
      role_id: loggedInUserRoleId, 
      department: customer.department,
      branch: customer.branch,
      emailId: customer.email_id,
      phoneNumber: customer.phone_number,
      pincode: customer.pincode,
      country: customer.country,
      state: customer.state,
      city: customer.city,
      landmark: customer.landmark,
      street: customer.street,
      teamHeadId: customer.team_head_id,
      isTeamHead: customer.is_team_head,
      roleBased: customer.role_based,
    };

    return res.status(201).json({
      success: true,
      message: 'Customer created successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the customer.',
    });
  }
};


// Get a customer by ID
exports.getCustomerById = async (req, res) => {
    const customerId = req.params.id;
  
    try {
      // Fetch the customer by ID
      const customer = await Customer.findByPk(customerId);
  
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found.',
        });
      }
  
      const responseData = {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        username: customer.username,
        roleName: customer.role_name,
        role_id: customer.role_id,
        department: customer.department,
        password:customer.password,
        branch: customer.branch,
        emailId: customer.email_id,
        phoneNumber: customer.phone_number,
        pincode: customer.pincode,
        country: customer.country,
        state: customer.state,
        city: customer.city,
        landmark: customer.landmark,
        street: customer.street,
        teamHeadId: customer.team_head_id,
        isTeamHead: customer.is_team_head,
        roleBased: customer.role_based,
      };
  
      return res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving the customer.',
      });
    }
  };

  
  // Update a customer by ID
exports.updateCustomerById = async (req, res) => {
    const customerId = req.params.id;
    const {
      firstName,
      lastName,
      username,
      password,
      roleName,
      department,
      branch,
      emailId,
      phoneNumber,
      pincode,
      country,
      state,
      city,
      landmark,
      street,
      teamHeadId,
      isTeamHead,
      roleBased,
    } = req.body;
  
    try {
      // Fetch the customer by ID
      const customer = await Customer.findByPk(customerId);
  
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found.',
        });
      }

      const existingCustomer = await Customer.findOne({
        where: {
          [Op.or]: [
            { phone_number: phoneNumber},
            { email_id:emailId },
          ],
          id: { [Op.ne]: customerId  }, 
        },
      });
  
      if (existingCustomer) {
        if (existingCustomer.phone_number === phoneNumber) {
          return res.status(400).json({
            success: false,
            message: 'Mobile number is already in use by another customer.',
          });
        }
        if (existingCustomer.email_id === emailId) {
          return res.status(400).json({
            success: false,
            message: 'Email ID is already in use by another customer.',
          });
        }
      }
  
      
  
      // Update the customer details
      customer.first_name = firstName;
      customer.last_name = lastName;
      customer.username = username;
      customer.password = password; // Don't forget to hash the password in production
      customer.role_name = roleName;
      customer.department = department;
      customer.branch = branch;
      customer.email_id = emailId;
      customer.phone_number = phoneNumber;
      customer.pincode = pincode;
      customer.country = country;
      customer.state = state;
      customer.city = city;
      customer.landmark = landmark;
      customer.street = street;
      customer.team_head_id = teamHeadId;
      customer.is_team_head = isTeamHead === 'true' || isTeamHead === true ? 1 : 0;
      customer.role_based = roleBased === 'true' || roleBased === true ? 1 : 0;
  
      // Save the updated customer
      await customer.save();
  
      return res.status(200).json({
        success: true,
        message: 'Customer updated successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the customer.',
      });
    }
  };
  
  
  // Delete a customer by ID
exports.deleteCustomerById = async (req, res) => {
    const customerId = req.params.id;
  
    try {
      // Fetch the customer by ID
      const customer = await Customer.findByPk(customerId);
  
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found.',
        });
      }
  
      // Delete the customer
      await customer.destroy();
  
      return res.status(200).json({
        success: true,
        message: 'Customer deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the customer.',
      });
    }
  };
  


  // Get all customers based on logged-in user's role_id
exports.getAllCustomersByRole = async (req, res) => {
    // Retrieve the logged-in user's role_id
    const loggedInUserRoleId = req.user.client_id || 1;
  
    try {
      // Fetch customers whose role_id matches the logged-in user's role_id
      const customers = await Customer.findAll({
        where: {
          role_id: loggedInUserRoleId,  // Filter customers by role_id
        },
      });
  
      if (customers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No customers found for this role.',
        });
      }
  
      // Prepare response data
      const responseData = customers.map(customer => ({
        id: customer.id,

        firstName: customer.first_name,
        lastName: customer.last_name,
        username: customer.username,
        roleName: customer.role_name,
        role_id: customer.role_id,
        department: customer.department,
        branch: customer.branch,
        emailId: customer.email_id,
        phoneNumber: customer.phone_number,
        pincode: customer.pincode,
        country: customer.country,
        state: customer.state,
        city: customer.city,
        landmark: customer.landmark,
        street: customer.street,
        teamHeadId: customer.team_head_id,
        isTeamHead: customer.is_team_head,
        roleBased: customer.role_based,
      }));
  
      return res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving the customers.',
      });
    }
  };
  