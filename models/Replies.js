const mongoose = require("mongoose");

//In the thread's 'replies' array will be saved => _id, text, created_on, delete_password, & reported.

const RepliesSchema = new mongoose.Schema({
  thread_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Thread"
  },
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now().toString()
  },
  reported: {
    type: Boolean,
    required: false
  },
  delete_password: {
    type: String,
    default: ""
  }
});

const Replies = mongoose.model("Replies", RepliesSchema);

module.exports = Replies;
