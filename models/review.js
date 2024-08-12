"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Review.init(
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
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan point review harus diisi",
          },
        },
        min: {
          args: [1],
          msg: "point tidak boleh kurang dari 1",
        },
        max: {
          args: [5],
          msg: "point tidak boleh lebih dari 5",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan content review harus diisi",
          },
        },
      },
    },

    {
      sequelize,
      modelName: "Review",
    }
  );

  return Review;
};
