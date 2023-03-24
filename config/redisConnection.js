const redis = require('redis');

const redisConnect = async () =>{
    try{
       const client = await redis.createClient();
        console.log("Redis Conntected!")
     }
     catch(err){
         console.log(err)
     }
}

module.exports = redisConnect