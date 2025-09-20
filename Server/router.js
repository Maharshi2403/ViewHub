const express = require('express')
const route = Router();
const PORT = 3000;
const app = express()

app.get("/user", )

app.listen(PORT, (err) => {
    if(err){
        console.log("Errot encountered at main rout")
    }else{
        console.log(`main rout listing on PORT: ${PORT}`)
    }
})

