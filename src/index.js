const express =require('express');

const app =express();

const {ServerConfig, logger }=require('./config');

app.listen(ServerConfig.PORT,()=>{
    console.log(`Server started successfully on PORT ${ServerConfig.PORT}`);
    logger.info(`Server started successfully on PORT ${ServerConfig.PORT}`)
})
