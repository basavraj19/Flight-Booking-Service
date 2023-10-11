const axios =require('axios');

const {BookingRepository}=require('../repositories');

const {ServerConfig}=require('../config');

const Bookings =new BookingRepository();

const {StatusCodes}=require('http-status-codes');

const {AppError}=require('../utils');

const { ENUM } =require('../utils/common');
const  { INITIATED,BOOKED,CANCELLED} =ENUM.booking_status;

const db = require('../models');

async function createBooking(data)
{
    const transaction = await db.sequelize.transaction();
    try {
        const result= await axios.get(`${ServerConfig.FLIGHT_SERVER}/api/v1/flight/${data.flightId}`);
        const flight =result.data.data;
        if(data.noOfSeats>flight.capacity)
        {
            throw new AppError('Enough seats are not avaliable',StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats*flight.price;
        const BookingPayload = {...data,totalPrice : totalBillingAmount ,status : INITIATED};
        const  response= await Bookings.createBooking(BookingPayload,transaction);
        await axios.patch(`${ServerConfig.FLIGHT_SERVER}/api/v1/flight/${data.flightId}`,{
            flightId : data.flightId,
            seats :data.noOfSeats,
            desc :1
        });
        transaction.commit();
        return response;
    } catch (error) {
        transaction.rollback();
        throw error;
    } 
}

async function makePayment(data)
{
    const transaction =await db.sequelize.transaction();
    try {
        const bookingDetails = await Bookings.get(data.bookingId,transaction);
        if(bookingDetails.status == CANCELLED)
        {
            throw new AppError('The booking is expired',StatusCodes.BAD_REQUEST);
        }
        if(data.totalAmount != bookingDetails.totalPrice)
        {
            throw new AppError('The payment amount does not matches.',StatusCodes.BAD_REQUEST);
        }
        if(data.userId != bookingDetails.userId)
        {
            throw new AppError('The user corresponding to booking does not matches.',StatusCodes.BAD_REQUEST);
        }
        const createdAt = bookingDetails.createdAt;
        const currentDate = new Date();
        if(currentDate-createdAt>300000)
        {
           cancelBooking(data.bookingId);
           throw new AppError('The time is expired.',StatusCodes.BAD_REQUEST);
        }
        await Bookings.update(data.bookingId,{status : BOOKED},transaction);
        transaction.commit();
        return true;
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId)
{
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await Bookings.get(bookingId,transaction);
        if(bookingDetails.status == CANCELLED)
        {
            await transaction.commit();
            return true;
        }
        await Bookings.update(bookingId,{status : CANCELLED},transaction);
        const response =await axios.patch(`${ServerConfig.FLIGHT_SERVER}/api/v1/flight/${bookingDetails.flightId}`,{
            flightId : bookingDetails.flightId,
            seats : bookingDetails.noOfSeats,
            desc :0
        });
        await transaction.commit();
        return response;
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}

module.exports ={
    createBooking,
    makePayment
}
