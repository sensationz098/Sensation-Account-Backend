const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate'); // Import the autopopulate plugin
const app = express()
app.use(express.json())
mongoose.plugin(autopopulate); // Enable autopopulate globally

const {connection} = require('./db/db.js')
const authRoute = require('./routes/auth.routes.js')

const cors = require("cors")

app.use(cors())
const UserProfile = require('./routes/user.routes.js')
const Courses = require('./routes/course.routes.js')
const Teachers = require('./routes/teachers.routes.js')
const Upload = require('./routes/fileUpload.routes.js')





app.use('/auth', authRoute)
app.use('/user', UserProfile)
app.use('/courses', Courses)
app.use('/teachers', Teachers)
app.use('/fileupload', Upload)


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



