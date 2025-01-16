'use strict';

module.exports = (sequelize, DataTypes) => {
  const Category  = sequelize.define('Category', {  // Changed Deportment to Department
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    role_id: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category : {  
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
    tableName: 'category', 
    timestamps: true,  
    createdAt: 'created_at',  
    updatedAt: 'updated_at',  
  });

  return Category ;
};
