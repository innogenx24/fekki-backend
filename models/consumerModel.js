'use strict';

module.exports = (sequelize, DataTypes) => {
  const Consumer = sequelize.define('Consumer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,  
    },
    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true, // Assuming mobile number should be unique
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    active_status: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1, // Default to active status (1 for active)
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure role_id is explicitly provided
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  
      onUpdate: DataTypes.NOW,
      field: 'updated_at',
    },
  }, {
    tableName: 'Consumer', // Name of the table
    timestamps: true,  
    createdAt: 'created_at',  
    updatedAt: 'updated_at',  
  });

  // Associations
  Consumer.associate = function(models) {
    // Define the hasMany relationship from Consumer to ConsumerProduct
    Consumer.hasMany(models.ConsumerProduct, { foreignKey: 'consumer_id', as: 'consumerProducts' });
  };

  return Consumer;
};
