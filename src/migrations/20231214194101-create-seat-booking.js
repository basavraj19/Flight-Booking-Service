'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seatBookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seatNo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>queryInterface.addIndex('seatBookings',['user_id', 'seatNo', 'flightId']));
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seatBookings');
  }
};