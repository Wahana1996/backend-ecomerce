"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.Product, {
        foreignKey: "productId",
      });
    }
  }
  Cart.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID4,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan userId harus diisi",
          },
          isExist(value) {
            return sequelize.models.User.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("user tidak ditemukan");
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
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan userName harus diisi",
          },
        },
      },
      nameProduct: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan nameProduct harus diisi",
          },
        },
      },
      imageProduct: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan imageProduct harus diisi",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan price harus diisi",
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
      modelName: "Cart",
    }
  );
  return Cart;
};
