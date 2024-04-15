const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    // required: false,
  },
  email: {
    type: String,
    // required: false,
  },
  contact: {
    type: mongoose.Schema.Types.Mixed,
    // required: true,
    default: 'NA'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  assignedUserId: {
   type: String,
   default: null,
},
  isLifetime : {
    type: String,
  },
course: {
      type: String,
    },
batch: {
      type: String,
      // required: true,
    },
timing: {
      type: String,
      // required: true
    },
date_of_payment: {
      type: Date,
      // required: true,
      default: Date.now()
    },
courseStartDate: {
      type: Date,
      // required: true,
      default: Date.now(),
    },
courseEndDate: {
      type: Date,
      // required: true,
      default: Date.now(),
    },
fee: {
      type: Number,
      // required: true,
    },
CourseDuration: {
      type: Number,
      default: 0,
      // required: true,
    },
Teacher : {
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
      type: Number
    },
    date_of_payment: {
      type: Date,
      required: true
    }, 
    createdAt: {
      type: Date,
      default: Date.now(),
      required: true
    }
  }],
createdAt: {
    type: Date,
    default: Date.now(),
    required: true
},
state: {  // New field for storing states
  type: String,
  required: true
},
extended: {
  type: Boolean,
  default: false
}
});

const studentModel = mongoose.model('Student', studentSchema);

module.exports = { studentModel };

