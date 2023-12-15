const { BookingService } = require('../services');

const { Successresponse, Errorrespones } = require('../utils/common');

const { StatusCodes } = require('http-status-codes');

const obj = {};

async function createBookings(req, res) {
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });
        Successresponse.data = response;
        return res.status(StatusCodes.CREATED).json(Successresponse);
    } catch (error) {
        Errorrespones.error = error;
        console.log(error);
        return res.json(Errorrespones);
    }
}


async function makePayment(req,res)
{
    try {
        console.log(req.headers);
        const idempotent = req.headers['x-idempotency-key'];
        console.log(idempotent);
        if(!idempotent)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({message : 'idempotent key missing'});
        }
        if(obj[idempotent])
        {
            return res.status(StatusCodes.BAD_REQUEST).json({message : 'retry on successfully request is not allowed'});
        }
        const response =await BookingService.makePayment({
            bookingId :req.body.bookingId,
            userId : req.body.userId,
            totalAmount :req.body.totalAmount
        })
        obj[idempotent] = idempotent;
        Successresponse.data = response;
        return res.status(StatusCodes.CREATED).json(Successresponse);
    } catch (error) {
        Errorrespones.error = error;
        console.log(error);
        return res.json(Errorrespones);
    }
}

async function cancelBookings(req, res) {
    try {
        const response = await BookingService.cancelBooking(req.query.bookingId);
        Successresponse.data = response;
        return res.status(StatusCodes.CREATED).json(Successresponse);
    } catch (error) {
        Errorrespones.error = error;
        return res.json(Errorrespones);
    }
}

async function generateBookingId(req,res){
    try {
        const bookingDetails = await BookingService.generateBookingId(req.body.userId);
        return bookingDetails;
    } catch (error) {
        Errorrespones.error = error;
        return res.json(Errorrespones);
    }
}

async function create(req,res){
    try {
        const response =await BookingService.cerate({
            user_id: req.body.userId,
            seatNo : req.body.seatNo,
            bookingId : req.body.bookingId,
            flightId: req.body.flightId
        });
        Successresponse.data = response;
        return res.status(StatusCodes.CREATED).json(Successresponse);
    } catch (error) {
        Errorrespones.error = error;
        return res.json(Errorrespones);
    }
}

module.exports = {
    createBookings,
    makePayment,
    cancelBookings,
    generateBookingId,
    create
}

