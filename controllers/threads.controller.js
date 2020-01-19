const Thread = require("../models/Thread");
const ObjectID = require("mongodb").ObjectID;

function ThreadsController() {
  this.get = async function(req, res) {
    const { board } = req.params;

    //I can GET an array of the most recent 10 bumped threads
    //on the board with only the most recent 3 replies from /api/threads/{board}.
    //The reported and delete_passwords fields will not be sent.
    try {
      const threads = await Thread.find({ board: board })
        // .populate("-delete_password")
        .select("-delete_password")
        .populate({
          path: "replies",
          select: "-delete_password",
          limit: 3,
          sort: "created_on"
        })
        .limit(10)
        .sort("created_on");

      // console.log(threads);
      res.json(threads);
    } catch (error) {
      console.log(error);
      res.send("There was a server error");
    }
  };

  this.post = async function(req, res) {
    const { board } = req.params;
    const { text, delete_password } = req.body;
    try {
      const thread = new Thread({
        board,
        text,
        delete_password
      });

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

      res.redirect(`/b/${board}`);
      // res.json({
      //   created_on: thread.created_on,
      //   bumped_on: thread.bumped_on,
      //   board: thread.board,
      //   _id: thread._id,
      //   text: thread.text
      // });
    } catch (error) {
      // console.log(error);
      res.send(error.message);
    }
  };
  this.put = async function(req, res) {
    const { board } = req.params;
    const { thread_id } = req.body;
    //change it's reported value to true. sending thread_id. (Text response will be 'success')
    try {
      const thread = await Thread.findById({ _id: new ObjectID(thread_id) });

      //   console.log(thread);
      if (!thread) {
        return res.send("Not Found");
      }
      if (thread.board === board) {
        thread.reported = true;
        await thread.save();
        res.send("success");
      } else {
        res.send("Invalid Board");
      }
    } catch (error) {
      console.log(error);
      res.send("There was an error");
    }
  };
  this.delete = async function(req, res) {
    const { board } = req.params;
    const { thread_id, delete_password } = req.body;
    //change it's reported value to true. sending thread_id. (Text response will be 'success')
    try {
      const thread = await Thread.findById({ _id: new ObjectID(thread_id) });

      if (!thread) {
        return res.send("Not Found");
      }

      if (thread.board === board) {
        if (thread.delete_password === delete_password) {
          await thread.remove();
          res.send("success");
        } else {
          res.send("incorrect password");
        }
      } else {
        res.send("Invalid Board");
      }
    } catch (error) {
      // console.log(error);
      res.status(400).send("Uncaught AssertionError");
    }
  };
}

module.exports = ThreadsController;
