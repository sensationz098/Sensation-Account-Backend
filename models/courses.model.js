const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    coursename : {
        type: String
    }
})

const courseModel = mongoose.model('courseModel', courseSchema)

module.exports = {courseModel}
