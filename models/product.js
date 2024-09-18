"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });

      //satu product memiliki banyak review
      Product.hasMany(models.Review, {
        foreignKey: "productId",
      });

      Product.hasMany(models.Shopping_cart_item, {
        foreignKey: "productId",
        as: "shoppingcartitem",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "name product sudah ada, silahkan masukkan name product lain",
        },
        validate: {
          notNull: {
            msg: "inputan name harus diisi",
          },
        },
      },
      description: DataTypes.STRING,
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan price harus diisi",
          },
        },
      },
      categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID4,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan categoryId harus diisi",
          },
          isExist(value) {
            return sequelize.models.Category.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("category tidak ditemukan");
              }
            });
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan image harus diisi",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countReview: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      avgReview: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
