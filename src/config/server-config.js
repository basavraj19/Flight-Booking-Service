const dotenv =require('dotenv');

dotenv.config();

module.exports ={
    PORT :process.env.PORT,
    FLIGHT_SERVER : process.env.FLIGHT_SERVER,
    KeyId : process.env.KeyID,
    KeySecret : process.env.KeySECRET
}