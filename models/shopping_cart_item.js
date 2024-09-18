"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shopping_cart_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shopping_cart_item.belongsTo(models.Shopping_cart, {
        foreignKey: "shoppingCartId",
        as: "cart",
      });

      Shopping_cart_item.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  Shopping_cart_item.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan productId harus diisi",
          },
          isExist(value) {
            return sequelize.models.Product.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("productId tidak ditemukan");
              }
            });
          },
        },
      },
      shoppingCartId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan productId harus diisi",
          },
          isExist(value) {
            return sequelize.models.Shopping_cart.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("productId tidak ditemukan");
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
    },
    {
      sequelize,
      modelName: "Shopping_cart_item",
    }
  );
  return Shopping_cart_item;
};
