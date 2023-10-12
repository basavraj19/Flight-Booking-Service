var cron = require('node-cron');

const { BookingService } =require('../../services');

function scheduleCron()
{
    cron.schedule('*/10 * * * * *', async() => {
           await BookingService.cancleOldBooking();
      });
}

module.exports = scheduleCron;