const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  BatchName: {
    type: String,
  },
});

const BatchModel = mongoose.model("Batch", courseSchema);

module.exports = { BatchModel };
