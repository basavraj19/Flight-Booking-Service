const axios = require('axios');

const { BookingRepository, SeatBookingRepository } = require('../repositories');

const { EmailQueueConfig } =require('../config');

const { ServerConfig } = require('../config');

const Bookings = new BookingRepository();

const SeatBooking = new SeatBookingRepository();

const { StatusCodes } = require('http-status-codes');

const { AppError } = require('../utils');

const { ENUM } = require('../utils/common');
const { INITIATED, BOOKED, CANCELLED } = ENUM.booking_status;

const db = require('../models');

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const result = await axios.get(`${ServerConfig.FLIGHT_SERVER}/api/v1/flight/${data.flightId}`);
        const flight = result.data.data;
        if (data.noOfSeats > flight.capacity) {
            throw new AppError('Enough seats are not avaliable', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flight.price;
        const BookingPayload = { ...data, totalPrice: totalBillingAmount, status: INITIATED };
        const response = await Bookings.createBooking(BookingPayload, transaction);
        await axios.patch(`${ServerConfig.FLIGHT_SERVER}/api/v1/flight/${data.flightId}`, {
            flightId: data.flightId,
            seats: data.noOfSeats,
            desc: 1
        });
        transaction.commit();
        return response;
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await Bookings.get(data.bookingId, transaction);
        if (bookingDetails.status == CANCELLED) {
            throw new AppError('The booking is expired', StatusCodes.BAD_REQUEST);
        }
        if (data.totalAmount != bookingDetails.totalPrice) {
            throw new AppError('The payment amount does not matches.', StatusCodes.BAD_REQUEST);
        }
        if (data.userId != bookingDetails.userId) {
            throw new AppError('The user corresponding to booking does not matches.', StatusCodes.BAD_REQUEST);
        }
        const createdAt = bookingDetails.createdAt;
        const currentDate = new Date();
        if (currentDate - createdAt > 300000) {
            cancelBooking(data.bookingId);
            throw new AppError('The time is expired.', StatusCodes.BAD_REQUEST);
        }
        await Bookings.update(data.bookingId, { status: BOOKED }, transaction);
        transaction.commit();
        EmailQueueConfig.sendData(bookingDetails);
        return true;
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await Bookings.get(bookingId, transaction);
        if (bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }
        await Bookings.update(bookingId, { status: CANCELLED }, transaction);
        const response = await axios.patch(`${ServerConfig.FLIGHT_SERVER}/api/v1/flight/${bookingDetails.flightId}`, {
            flightId: bookingDetails.flightId,
            seats: bookingDetails.noOfSeats,
            desc: 0
        });
        await transaction.commit();
        return response;
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}

async function cancleOldBooking() {
    try {
        const time = new Date(Date.now() - 1000 * 300);
        const response = await Bookings.updateOldBooking(time);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function bookingDetails(bookingId){
    try {
        const bookingDetails = await Bookings.getbyId(bookingId);
        if(!bookingDetails)
        {
            throw new AppError('Invalid Booking Details',StatusCodes.NOT_FOUND);
        }
        return bookingDetails;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function generateBookingId(userId){
   try {
     const booking = await Bookings.getBookingByUserID(userId);
     booking.totalPrice=booking.totalPrice*100;
     console.log(booking);
     return booking;
   } catch (error) {
       console.log(error);
       throw error;
   }
}

async function cerate(data){
   try {
    const booking = await SeatBooking.create(data);
    return booking;
   } catch (error) {
    console.log(error);
    throw error;
   }
}

module.exports = {
    createBooking,
    makePayment,
    cancleOldBooking,
    cancelBooking,
    bookingDetails,
    generateBookingId,
    cerate
}
