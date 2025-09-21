const mongoose = require('mongoose');
const env = require('dotenv').config
const Users  = require('./userSchema')

async function connection(){
    try{
        const response = await mongoose.connect(`${DB_STRING}`);

        if(response.ok()){
            console.log("database connection successfull!!!!")
        }else{
            console.log("connection did not established.")
        }
    }catch(err){
        console.log('Error in database connection!!!')
        console.log(err)
    }


}

connection()



