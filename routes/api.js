/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const ThreadsController = require("../controllers/threads.controller");
const RepliesController = require("../controllers/replies.controller");

const threadsController = new ThreadsController();
const repliesController = new RepliesController();
module.exports = function(app) {
  app.route("/api/threads/:board").get(threadsController.get);
  app.route("/api/threads/:board").post(threadsController.post);
  app.route("/api/threads/:board").put(threadsController.put);
  app.route("/api/threads/:board").delete(threadsController.delete);
  app.route("/api/replies/:board").get(repliesController.get);
  app.route("/api/replies/:board").post(repliesController.post);
  app.route("/api/replies/:board").put(repliesController.put);
  app.route("/api/replies/:board").delete(repliesController.delete);
};
