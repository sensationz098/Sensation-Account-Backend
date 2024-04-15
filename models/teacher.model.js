const mongoose = require('mongoose')

const TeacherSchema = mongoose.Schema({
    TeacherName : {
        type: String,
        required: true
    },
    CourseName : {
        type: String,
        required: true
    }
})


const teacherModel = mongoose.model('Teachers', TeacherSchema)

module.exports = {teacherModel}