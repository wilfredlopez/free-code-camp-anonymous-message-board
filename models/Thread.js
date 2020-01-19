const mongoose = require("mongoose");

//Saved will be _id, text, created_on(date&time),
//bumped_on(date&time, starts same as created_on),
//reported(boolean), delete_password, & replies(array).

const ThreadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now().toString()
  },
  bumped_on: {
    type: Date,
    default: Date.now().toString()
  },
  reported: {
    type: Boolean,
    required: false
  },
  delete_password: {
    type: String,
    required: true
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Replies" }],
  board: {
    type: String,
    default: ""
  }
  // replies: {
  //   type: [String],
  //   default: []
  // }
});
//In the thread's 'replies' array will be saved => _id, text, created_on, delete_password, & reported.
ThreadSchema.pre("save", function(next) {
  const now = Date.now().toString();
  this.created_on = now;
  this.bumped_on = now;
  next();
});

ThreadSchema.pre("update", function(next) {
  this.bumped_on = Date.now().toString();
  next();
});

const Thread = mongoose.model("Thread", ThreadSchema);

module.exports = Thread;
