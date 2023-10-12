const { BookingService } = require('../services');

const { Successresponse, Errorrespones } = require('../utils/common');

const { StatusCodes } = require('http-status-codes');

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
        return res.json(Errorrespones);
    }
}


async function makePayment(req,res)
{
    try {
        const response =await BookingService.makePayment({
            bookingId :req.body.bookingId,
            userId : req.body.userId,
            totalAmount :req.body.totalAmount
        })
        Successresponse.data = response;
        return res.status(StatusCodes.CREATED).json(Successresponse);
    } catch (error) {
        Errorrespones.error = error;
        return res.json(Errorrespones);
    }
}

module.exports = {
    createBookings,
    makePayment
}

