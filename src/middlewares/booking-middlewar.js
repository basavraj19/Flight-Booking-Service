const { BookingService }=require('../services');

const { Errorrespones } =require('../utils/common');

const AppError =require('../utils/error/AppError');

const { StatusCodes }=require('http-status-codes');

async function validateCancelBookingRequest(req,res,next){
    try {
        const bookingDetails = await BookingService.bookingDetails(req.query.bookingId);
        if(!bookingDetails.userId == req.query.userId)
        {
            Errorrespones.message = 'User donot have the authority for this action';
            Errorrespones.error = new AppError('unauthorised', StatusCodes.UNAUTHORIZED);
            return res.status(Errorrespones.error.statuscode).json(Errorrespones);  
        }
        next();
    } catch (error) {
        throw error;
    }
}

module.exports ={
    validateCancelBookingRequest
}