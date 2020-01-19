const Thread = require("../models/Thread");
const Replies = require("../models/Replies");
const ObjectID = require("mongodb").ObjectID;

function RepliesController() {
  this.get = async function(req, res) {
    const { board } = req.params;

    const { thread_id } = req.query;
    // console.log(board, thread_id);

    //I can GET an entire thread
    //with all it's replies from /api/replies/{board}?thread_id={thread_id}.
    //The reported and delete_passwords fields will not be sent.
    const threads = await Thread.find({
      board: board,
      _id: new ObjectID(thread_id)
    })
      // .populate("-delete_password")
      .select("-delete_password")
      .populate({
        path: "replies",
        select: "-delete_password",
        sort: "created_on"
      })
      .sort("created_on");

    res.json(threads);
  };

  this.post = async function(req, res) {
    const { board } = req.params;
    const { text, delete_password, thread_id } = req.body;
    try {
      const thread = await Thread.findById({ _id: new ObjectID(thread_id) });

      if (!thread) {
        return res.send("Thead Not Found");
      }

      if (thread.board !== board) {
        return res.send("Invalid Board");
      }

      const reply = new Replies({
        thread_id,
        text,
        delete_password
      });

      await reply.save();

      thread.replies.push(reply);

      await thread.save();

      //   {
      //     created_on: "2020-01-19T15:47:23.920Z",
      //     bumped_on: "2020-01-19T15:47:23.920Z",
      //     delete_password: "password",
      //     board: "new",
      //     _id: "5e247a0b9a639952d8f18dc9",
      //     text: "lkjlkjlkjlkj",
      //     __v: 0
      //     }

      res.redirect(`/b/${board}/${thread_id}`);
      //   res.json(reply);
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  };
  this.put = async function(req, res) {
    //I can report a reply and change it's reported value to true
    //by sending a PUT request to /api/replies/{board} and pass along
    //the thread_id & reply_id. (Text response will be 'success')
    const { board } = req.params;
    const { thread_id, reply_id } = req.body;

    // console.log(req.body);
    try {
      const reply = await Replies.findById(new ObjectID(reply_id));

      if (!reply) {
        return res.send("reply not found");
      }
      reply.reported = true;
      await reply.save();
      res.send("success");
    } catch (error) {
      // console.log(error);

      res.status(400).send("Uncaught AssertionError");
    }
  };
  this.delete = async function(req, res) {
    const { board } = req.params;
    const { thread_id, reply_id, delete_password } = req.body;
    try {
      const reply = await Replies.findById({ _id: new ObjectID(reply_id) });

      if (!reply) {
        return res.send("Not Found");
      }

      if (reply.delete_password === delete_password) {
        await reply.remove();
        res.send("success");
      } else {
        res.send("incorrect password");
      }
    } catch (error) {
      // console.log(error);
      res.status(400).send("Uncaught AssertionError");
    }
  };
}

module.exports = RepliesController;
