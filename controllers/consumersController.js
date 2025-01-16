const { Consumer, ConsumerProduct } = require('../models');
const { Op } = require('sequelize');

exports.createConsumer = async (req, res) => {
    const { firstName, mobileNumber, email, activeStatus, selectedProducts } = req.body;

    try {
        const existingConsumer = await Consumer.findOne({
            where: {
                [Op.or]: [
                    { mobile_number: mobileNumber },
                    { email: email }
                ]
            }
        });

        if (existingConsumer) {
            if (existingConsumer.mobile_number === mobileNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Mobile number already exists.',
                });
            }

            if (existingConsumer.email === email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists.',
                });
            }
        }

        const loggedInUserRoleId = req.user.client_id || 1;

        // Create the new consumer
        const consumer = await Consumer.create({
            first_name: firstName,
            mobile_number: mobileNumber,
            email,
            active_status: activeStatus === 'true' || activeStatus === true ? 1 : 0,
            role_id: loggedInUserRoleId,
        });

        if (Array.isArray(selectedProducts) && selectedProducts.length > 0) {
            const consumerProducts = selectedProducts.map((productId) => ({
                consumer_id: consumer.id,
                product_id: productId,
            }));

            await ConsumerProduct.bulkCreate(consumerProducts);
        }

        return res.status(201).json({
            success: true,
            message: 'Consumer created successfully.',
            data: consumer,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating the consumer.',
            error: error.message,
        });
    }
};



/////CONSUMER UPDATE//////////////


exports.updateConsumer = async (req, res) => {
    const { id } = req.params;
    const { firstName, mobileNumber, email, activeStatus, selectedProducts } = req.body;

    try {
        // Check if the consumer exists
        const consumer = await Consumer.findByPk(id);

        if (!consumer) {
            return res.status(404).json({
                success: false,
                message: 'Consumer not found.',
            });
        }

        // Check if the mobileNumber or email already exists (excluding the current consumer)
        const existingConsumer = await Consumer.findOne({
            where: {
                [Op.or]: [
                    { mobile_number: mobileNumber },
                    { email: email }
                ],
                id: { [Op.ne]: id } // Exclude the current consumer from the check
            }
        });

        if (existingConsumer) {
            if (existingConsumer.mobile_number === mobileNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Mobile number already exists.',
                });
            }

            if (existingConsumer.email === email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists.',
                });
            }
        }

        // Update the consumer details
        await consumer.update({
            first_name: firstName,
            mobile_number: mobileNumber,
            email,
            active_status: activeStatus === 'true' || activeStatus === true ? 1 : 0,
        });

        // Remove existing consumer product associations
        await ConsumerProduct.destroy({
            where: {
                consumer_id: consumer.id,
            },
        });

        // If selectedProducts is provided and not empty, create new ConsumerProduct records
        if (Array.isArray(selectedProducts) && selectedProducts.length > 0) {
            const consumerProducts = selectedProducts.map((productId) => ({
                consumer_id: consumer.id,
                product_id: productId,
            }));

            // Bulk insert new ConsumerProduct records
            await ConsumerProduct.bulkCreate(consumerProducts);
        }

        return res.status(200).json({
            success: true,
            message: 'Consumer updated successfully.',
            data: consumer,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the consumer.',
            error: error.message,
        });
    }
};


////////////Get all consumers///////////



exports.getAllConsumers = async (req, res) => {
const loggedInUserRoleId = req.user.client_id !== null ? req.user.client_id : 1;

    try {
        // Fetch customers whose role_id matches the logged-in user's role_id
        const consumers = await Consumer.findAll({
            where: {
                role_id: loggedInUserRoleId, // Filter customers by role_id
            },
        });

        // Send the response with the list of consumers
        return res.status(200).json({
            success: true,
            message: 'Consumers fetched successfully.',
            data: consumers,
        });
    } catch (error) {
        console.error('Error fetching consumers:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching consumers.',
            error: error.message,
        });
    }
};



// Get a consumer by ID
exports.getConsumerById = async (req, res) => {
    const { id } = req.params; // Get the consumer ID from the URL

    try {
        // Find consumer by primary key along with associated ConsumerProduct records
        const consumer = await Consumer.findByPk(id, {
            include: [{
                model: ConsumerProduct,  // Specify the ConsumerProduct model
                as: 'consumerProducts',  // Use the alias as defined in the association
                attributes: ['product_id'] // Specify which fields you want to include
            }],
        });

        if (!consumer) {
            return res.status(404).json({
                success: false,
                message: 'Consumer not found.',
            });
        }

        return res.status(200).json({
            success: true,
            data: consumer,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the consumer.',
            error: error.message,
        });
    }
};

// Delete a consumer by ID
exports.deleteConsumer = async (req, res) => {
    const { id } = req.params; // Get the consumer ID from the URL

    try {
        // Find the consumer by ID
        const consumer = await Consumer.findByPk(id);

        if (!consumer) {
            return res.status(404).json({
                success: false,
                message: 'Consumer not found.',
            });
        }

        // Delete associated products first
        await ConsumerProduct.destroy({
            where: { consumer_id: consumer.id },
        });

        // Now, delete the consumer record
        await consumer.destroy();

        return res.status(200).json({
            success: true,
            message: 'Consumer deleted successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the consumer.',
            error: error.message,
        });
    }
};