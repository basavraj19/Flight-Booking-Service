'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seatBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  seatBooking.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seatNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'seatBooking',
  });
  return seatBooking;
};