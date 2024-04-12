const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate'); // Import the autopopulate plugin

mongoose.plugin(autopopulate); // Enable autopopulate globally

const {connection} = require('./db/db.js')
const authRoute = require('./routes/auth.routes.js')
const app = express()
const cors = require("cors")

app.use(cors())
const UserProfile = require('./routes/user.routes.js')
const Courses = require('./routes/course.routes.js')
// const {errorHandler} = require('./middlewares/error.middleware.js')
app.use(express.json())



app.use('/auth', authRoute)
app.use('/user', UserProfile)
app.use('/courses', Courses)

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



