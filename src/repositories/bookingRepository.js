const CrudRepository =require('./crudRepository');

const {Bookings}=require('../models');

class BookingRepository extends CrudRepository{
    constructor ()
    {
        super(Bookings);
    }
}

module.exports =BookingRepository;
