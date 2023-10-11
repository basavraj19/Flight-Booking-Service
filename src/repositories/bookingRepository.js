const CrudRepository =require('./crudRepository');

const {Booking}=require('../models');

class BookingRepository extends CrudRepository{
    constructor ()
    {
        super(Booking);
    }

    async createBooking(data,t)
    {
        const respones = await Booking.create(data, {transaction: t});
        return respones;
    }

    async get(id,transaction)
    {
        const respones =await  Booking.findByPk(id,{ transaction : transaction });
        if(!respones)
        {
            throw new AppError("Resouce not found",StatusCodes.NOT_FOUND);
        }
        return respones;
    }

    async update(id, data,transaction)
    {
        const respone =await Booking.update(data,{
            where :{
                id :id
            }
        },{transaction : transaction})
       if(!respone)
       {
           throw new AppError("Resouce not found",StatusCodes.NOT_FOUND);
       }
       return respone;
    }

}

module.exports =BookingRepository;
