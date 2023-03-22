const mongoose = require('mongoose');

const connectDb = async () => {
    try{
       const connect = await mongoose.connect(process.env.DB_CONN_STR);
        console.log(
            "Databse Connected: ",
            connect.Connection.name
        )
    }
    catch(err){
        console.log(err)
        process.exit()
    }
}


module.exports = connectDb