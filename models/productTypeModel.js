'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProductType  = sequelize.define('ProductType', {  
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    role_id: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_type : {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active_status: {  
        type: DataTypes.INTEGER,
        defaultValue: 0,  
        allowNull: false,
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
    tableName: 'productType', 
    timestamps: true,  
    createdAt: 'created_at',  
    updatedAt: 'updated_at',  
  });

  return ProductType ;
};
