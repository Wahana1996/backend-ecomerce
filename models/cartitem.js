"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cartId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID4,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan cartId harus diisi",
          },
          isExist(value) {
            return sequelize.models.User.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("cartId tidak ditemukan");
              }
            });
          },
        },
      },
      productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID4,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan productId harus diisi",
          },
          isExist(value) {
            return sequelize.models.Product.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("product tidak ditemukan");
              }
            });
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan quantity review harus diisi",
          },
        },
        min: {
          args: [1],
          msg: "quantity tidak boleh kurang dari 1",
        },
        max: {
          args: [1000000],
          msg: "quantity tidak boleh lebih dari 1000000",
        },
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
    }
  );
  return CartItem;
};
