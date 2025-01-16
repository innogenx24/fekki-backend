'use strict';

module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {  // Changed Deportment to Department
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    role_id: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    department: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'department', 
    timestamps: true,  
    createdAt: 'created_at',  
    updatedAt: 'updated_at',  
  });

  return Department;
};
