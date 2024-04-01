const express = require('express')
require('dotenv').config()
const {connection} = require('./db/db.js')
const authRoute = require('./routes/auth.routes.js')
const app = express()
const cors = require("cors")

app.use(cors())
const UserProfile = require('./routes/user.routes.js')
const {errorHandler} = require('./middlewares/error.middleware.js')
// const {authenticateUser} = require('./middlewares/auth.middleware.js')
app.use(express.json())



app.use('/auth', authRoute)
app.use('/user', UserProfile)

app.get('/', (_req,res) => {
    res.send("Hello World!!")
    console.log('Working')
})

app.listen(process.env.PORT, async () => {
    try{
      await connection
      console.log(`Connected to the DB successfully`)
    }
    catch(err){
        console.log(err.message)
    }
    console.log(`Server is running on ${process.env.PORT}`)
})



