const CrudRepository =require('./crudRepository');

const { seatBooking } =require('../models');

class SeatBookingRepository extends CrudRepository{
    constructor(){
        super(seatBooking);
    }
}

module.exports=SeatBookingRepository;
