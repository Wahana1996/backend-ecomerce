"use strict";
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSaltSync(10);
    const adminId = await queryInterface.rawSelect(
      "roles",
      {
        where: {
          name: "Admin",
        },
      },
      ["id"]
    );
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: v4(),
          name: "admin",
          email: "admin@email.com",
          password: bcrypt.hashSync("12345678", salt),
          roleId: adminId,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
