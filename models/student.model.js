const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    default: 'NA@gmail.com'
  },
  contact: {
    type: String,
    default: null,
  },
  receipt :  {
    type: String,
    default: 'NA'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedUserId: {
    type: String,
    default: 'NA',
  },
  isLifetime: {
    type: String,
    default: 'false'
  },
  course: {
    type: String,
    default: 'NA'
  },
  timing: {
    type: String,
    default: 'Not Confirmed'
  },
  date_of_payment: {
    type: Date,
    default: null,
  },
  courseStartDate: {
    type: Date,
    default: null,
  },
  courseEndDate: {
    type: Date,
    default: null,
  },
  fee: {
    type: String,
    default: 'NA'
  },
  CourseDuration: {
    type: String,
    default: 'NA'
  },
  Teacher: {
    type: String,
    default: "Not Confirmed"
  },
  assignedUserName: {
    type: String,
    default: 'NA'
  },
  previousCourses: [{
    start: {
      type: Date,
      default: null,
  },
    end: {
      type: Date,
      default: null,
  },
    amount: {
      type: Number,
  },
    extendedBy: {
      type: Number,
  },
    date_of_payment: {
      type: Date,
      required: true,
  },
    NewReceipt: {
      type: String,
      default: 'NA'
  },
    createdAt: {
      type: Date,
      default: Date.now(),
      required: true,
  },
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  state: {
    type: String,
    default: "NA"
  },
  extended: {
    type: Boolean,
    default: false,
  },
});


const studentModel = mongoose.model('Student', studentSchema);

module.exports = { studentModel };

