const express = require('express');
const Auth = express.Router();
const z = require('zod');

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
Auth.post("/Signup", (req,res) =>{
       try{
          const validate = ZodValidation_signup.safeParse(req.body);

          if(validate){
               console.log("validation for signup passed")
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
Auth.post("/Signin", (req,res) =>{
  try{
      const validate = ZodValidation_login.safeParse(req.body);

      if(validate){
          console.log("validation for login succssesfull")

          res.status(200).send({
               msg: "validation for login succsses"
          })
      }
  }catch(ERROR){
     console.log("Validation error in login")
     console.log(ERROR)
  }

})


module.exports = Auth;