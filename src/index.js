const express =require('express');

const app =express();

const {ServerConfig, logger }=require('./config');

const api=require('./router');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api',api);

app.listen(ServerConfig.PORT,()=>{
    console.log(`Server started successfully on PORT ${ServerConfig.PORT}`);
    logger.info(`Server started successfully on PORT ${ServerConfig.PORT}`)
})
