const express = require('express');
const Auth = express.Router();
const z = require('zod');
const jwt = require('jsonwebtoken')
const Users = require('../Database/connection')


const ZodValidation_signup = z.object({
    userName: z.email(),
    password: z.string().min(8).max(15),
    firstName: z.string().max(10),
    lastName: z.string().max(10)
})


Auth.get("/test", (req,res) =>{
     console.log("route reaches auth/test")
     res.status(200).send({
          msg: "connection request recieved!!"
     })
})


//username: xyz@email.com
//password:aef421!3434@$%eb
//firstName: ram
//lastName: patel
Auth.post("/Signup", async(req,res) =>{
       try{
          const validate = ZodValidation_signup.safeParse(req.body);

          if(validate){
               console.log("validation for signup passed")
               // Databse update here
               const val = await Users.findOne({
                    userName: req.body.userName
               })

               if(val){
                    res.status(403).send({
                         msg: "user alrady exist with this email"
                    })
               }
               
               if(!val){
                    const saveUser = await Users.create({
                         userName: req.body.userName,
                         password: req.body.password,
                         firstName: req.body.firstName,
                         lastName: req.body.lastName,
                    })
                    const done = await saveUser.save()
                    console.log("database is updated! - new user onboard!!")
               }

               res.status(200).send({
                    msg: "Validation succsess for signup!"
               })
          }
       }catch(ERROR){
          console.log("Error occured on validation of (signup):")
          console.log(ERROR)
       }



 })


 ZodValidation_login = z.object({
     userName: z.email(),
     password: z.string(),
 })


//username: xyz@email.com
//password:aef421!3434@$%eb
Auth.post("/Signin",async (req,res) =>{
  try{
      const validate = ZodValidation_login.safeParse(req.body);

      if(validate){
          console.log("validation for login succssesfull")
          
          const val = await Users.findOne({
               userName: req.body.userName
          })
          
          // IMPORTANT: order of comparision matters
          if(req.body.password !== val.password){
              res.status(404).send("INCORRECT: PASSWORD OR USERNAME!")
          }

          res.status(200).send({
               msg: "user loggedIn"
          })
      }
  }catch(ERROR){
     console.log("Validation error in login")
     console.log(ERROR)
  }

})

Auth.put("/update", (req,res)=>{

})


module.exports = Auth;