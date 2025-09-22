import { lowercase, maxLength, minLength } from 'zod';

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

export default Users = mongoose.model('user', user)

