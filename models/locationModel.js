'use strict';

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,  
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
    active_status: {  
      type: DataTypes.INTEGER,
      defaultValue: 0,  
      allowNull: false,
    },
    role_id: {  
        type: DataTypes.STRING(255),
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
    tableName: 'locations',  // Table name for the location model
    timestamps: true,  
    createdAt: 'created_at',  
    updatedAt: 'updated_at',  
  });

  return Location;
};
