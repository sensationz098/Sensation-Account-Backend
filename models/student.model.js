const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  contact: {
    type: String,
    default: null,
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
  },
  course: {
    type: String,
  },
  reciept: {
    type: Number
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
  },
  CourseDuration: {
    type: String,
  },
  Teacher: {
    type: String,
  },
  assignedUserName: {
    type: String
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
    // required: true,
  },
  extended: {
    type: Boolean,
    default: false,
  },
});


const studentModel = mongoose.model('Student', studentSchema);

module.exports = { studentModel };

