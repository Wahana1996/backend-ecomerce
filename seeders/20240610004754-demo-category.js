"use strict";

const { v4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Categories", [
      {
        id: v4(),
        name: "pertanian",
        description: "kelapa sawit lorem ipsum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        name: "perikanan",
        description: "udang lorem ipsum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        name: "pertambangan",
        description: "emas lorem ipsum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
