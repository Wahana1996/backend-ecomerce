"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shopping_cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shopping_cart.hasMany(models.Shopping_cart_item, {
        foreignKey: "shoppingCartId",
        as: "items",
      });
    }
  }
  Shopping_cart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan userId harus diisi",
          },
        },
        isExist(value) {
          return sequelize.models.User.findByPk(value).then((el) => {
            if (!el) {
              throw new Error("userId tidak ditemukan");
            }
          });
        },
      },
    },
    {
      sequelize,
      modelName: "Shopping_cart",
    }
  );
  return Shopping_cart;
};
