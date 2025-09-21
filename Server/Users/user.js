const express = requir('express');
const z = require('zod');
const Auth = express.Route();


Auth.get("/test", (req,res) =>{
     console.log("route reaches auth/test")
})

Auth.post("/Signup", (req,res) =>{

})
