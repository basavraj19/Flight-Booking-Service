const express =require('express');

const router =express.Router();

const {BookingController}=require('../../controllers');

const { validateCancelBookingRequest } =require('../../middlewares/booking-middlewar');

router.post('/',BookingController.createBookings);

router.post('/payments',BookingController.makePayment);

router.delete('/',validateCancelBookingRequest,BookingController.cancelBookings);

router.post('/create',BookingController.create);

module.exports =router;