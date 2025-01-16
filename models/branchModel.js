'use strict';

module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
    },
    branch_name: {  
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    country: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {  
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    pincode: {  
        type: DataTypes.STRING(6),
        allowNull: false,
      },
    active_status: {  
      type: DataTypes.INTEGER,
      defaultValue: 0,  
      allowNull: false,
    },
    role_id: {  
        type: DataTypes.INTEGER(255),
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
    tableName: 'branch', 
    timestamps: true,  
    createdAt: 'created_at',  
    updatedAt: 'updated_at',  
  });

  return Branch;
};
