
const mongoose = require('mongoose')
const env = require('dotenv').config()


async function connection(){
    try{
        const response = await mongoose.connect(`${process.env.DB_STRING}`);

        if(response.ok){
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

const user = new mongoose.Schema({
   firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 10
   },

   lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 10
   },

   userName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minLength: 9,
    maxLength: 30
   },
   

   password:{
    type:String,
    required: true,
    minLength: 8
   }

})

const Users = mongoose.model('user', user)
module.exports = Users
