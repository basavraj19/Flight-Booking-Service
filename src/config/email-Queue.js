const amqplib= require('amqplib');

var connection, channel

async function connectQueue(){
   try {
    connection =await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('Email-Queue');
   } catch (error) {
      console.log(error);
      throw error;
   }
}

async function sendData(data){
    try {
        channel.sendToQueue('Email-Queue',Buffer.from(JSON.stringify(data)));   
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports ={
    connectQueue,
    sendData
}