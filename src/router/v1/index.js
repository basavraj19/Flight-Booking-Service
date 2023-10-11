const express =require('express');

const router = express.Router();

const bookingrouters =require('./bookings');

router.get('/info',(req,res)=>{
    return res.json({
        message : 'success',
        data : {}
    })
});

router.use('/bookings',bookingrouters);

module.exports =router;