"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("carts", "userName", {
        type: Sequelize.STRING,
        after: "productId",
      }),
      queryInterface.addColumn("carts", "nameProduct", {
        type: Sequelize.STRING,
        after: "userName",
      }),
      queryInterface.addColumn("carts", "imageProduct", {
        type: Sequelize.STRING,
        after: "nameProduct",
      }),
      queryInterface.addColumn("carts", "price", {
        type: Sequelize.INTEGER,
        after: "imageProduct",
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("carts", "userName"),
      queryInterface.removeColumn("carts", "nameProduct"),
      queryInterface.removeColumn("carts", "imageProduct"),
      queryInterface.removeColumn("carts", "price"),
    ]);
  },
};
