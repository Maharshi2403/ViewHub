const express = require('express')
const userRoute = require('./Users/user')
const cors = require('cors')
const PORT = 3000;
const app = express()

//intial cors allows * network address to bypass errors
app.use(cors())
app.use(express.json())

//Authentication Routs
app.get("/auth", userRoute)


app.listen(PORT, (err) => {
    if(err){
        console.log("Errot encountered at main rout")
    }else{
        console.log(`main rout listing on PORT: ${PORT}`)
    }
})

