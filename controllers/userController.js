const jwt = require('jsonwebtoken');
const { User, Client } = require('../models');

exports.userLogin = async (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user by username
    const user = await User.findOne({
      where: { username }
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check if user has a valid client_id
    if (user.client_id) {
      // Find the associated client record based on client_id
      const client = await Client.findOne({
        where: { id: user.client_id }
      });

      // Check if client exists
      if (!client) {
        return res.status(404).json({ message: 'Associated client not found' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role_name: user.role_name,
        client_id: user.client_id || null,  // Include client_id if found
      },
      process.env.JWT_SECRET, // Ensure you have this in your .env file
      { expiresIn: '1h' } // Set an expiration time (optional)
    );

    // Send response with token
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        role_id: user.role_id,
        username: user.username,
        role_name: user.role_name,
        client_id: user.client_id || null,  // Include client_id in the response
      },
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
};
