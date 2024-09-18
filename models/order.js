"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "items",
      });

      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Order.init(
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
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan orderId harus diisi",
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
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan totalPrice harus diisi",
          },
        },
      },
      paymentStatus: {
        type: DataTypes.ENUM(
          "pending",
          "paid",
          "failed",
          "canceled",
          "expired"
        ),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
