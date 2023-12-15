const CrudRepository = require('./crudRepository');

const { Booking } = require('../models');

const { Op } = require("sequelize");

const { ENUM } = require('../utils/common');
const { BOOKED, CANCELLED } = ENUM.booking_status;

const AppError =require('../utils/error/AppError');
const { StatusCodes }=require('http-status-codes');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(data, t) {
        const respones = await Booking.create(data, { transaction: t });
        return respones;
    }

    async get(id, transaction) {
        const respones = await Booking.findByPk(id, { transaction: transaction });
        if (!respones) {
            throw new AppError("Resouce not found", StatusCodes.NOT_FOUND);
        }
        return respones;
    }

    async update(id, data, transaction) {
        const respone = await Booking.update(data, {
            where: {
                id: id
            }
        }, { transaction: transaction })
        if (!respone) {
            throw new AppError("Resouce not found", StatusCodes.NOT_FOUND);
        }
        return respone;
    }

    async updateOldBooking(time) {
        const response = await Booking.update({ status: CANCELLED }, {
            where: {
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.lt]: time
                        }
                    },
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    },
                    {
                        status: {
                            [Op.ne]: CANCELLED
                        }
                    }
                ]
            }
        });
        return response;
    }

    async getBookingByUserID(userId){
        const booking = Booking.findOne({where : {
            userId : userId
        }});
        if(!booking){
            throw new AppError("Resouce not found", StatusCodes.NOT_FOUND);
        }
        return booking;
    }

}

module.exports = BookingRepository;
