"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderIds",
        as: "order",
      });

      OrderItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderIds: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan orderIds harus diisi",
          },
          isExist(value) {
            return sequelize.models.Order.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("orderIds tidak ditemukan");
              }
            });
          },
        },
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
      quantity: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        // validate: {
        //   notNull: {
        //     msg: "inputan quantity harus diisi",
        //   },
        // },
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
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan total harus diisi",
          },
        },
      },
    },

    {
      hooks: {
        beforeCreate: async (orderItem) => {
          orderItem.total = orderItem.quantity * orderItem.price;
        },
      },
      sequelize,
      modelName: "OrderItem",
    }
  );
  return OrderItem;
};
