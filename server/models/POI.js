const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class POI extends Model {}

POI.init({
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING }, // Education, Therapy, etc.
  x_pos: { type: DataTypes.INTEGER }, // % from left
  y_pos: { type: DataTypes.INTEGER }  // % from top
}, { sequelize, modelName: 'poi' });

module.exports = POI;