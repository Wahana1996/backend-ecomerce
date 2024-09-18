'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AddColumnCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AddColumnCart.init({
    addcolumn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AddColumnCart',
  });
  return AddColumnCart;
};