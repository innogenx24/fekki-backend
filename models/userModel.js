'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    username: {  
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, 
    },
    mobile_number: {  
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_name: {  // Add the role_name field
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    client_id: {  // Add the role_id field
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {  // Add the role_id field
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,  // You can set a default value for role_id (1 for Admin)
    },
  }, {
    tableName: 'user', 
    timestamps: false,
  });

  return User;
};
