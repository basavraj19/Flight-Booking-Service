const express =require('express');

const router = express.Router();

const v1router =require('./v1');

router.use('/v1',v1router);

module.exports =router;