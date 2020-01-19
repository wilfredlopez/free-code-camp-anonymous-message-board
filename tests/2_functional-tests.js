/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

const board = "general";
const testDeletePassword = "testpassword123";

let latestThreadId = "";
let replyID = "";

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("valid post", function(done) {
        const postText = "valid post";
        chai
          .request(server)
          .post(`/api/threads/${board}`)
          .send({ text: postText, delete_password: testDeletePassword })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.header["x-powered-by"], "Wilfred Lopez");

            done();
          });
      });
      test("invalid post (missing text field)", function(done) {
        chai
          .request(server)
          .post(`/api/threads/${board}`)
          .send({ delete_password: testDeletePassword })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.header["x-powered-by"], "Wilfred Lopez");
            assert.equal(
              res.text,
              "Thread validation failed: text: Path `text` is required."
            );
            done();
          });
      });
      test("invalid post (missing delete_password field)", function(done) {
        const postText = "invalid post";
        chai
          .request(server)
          .post(`/api/threads/${board}`)
          .send({ text: postText })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.header["x-powered-by"], "Wilfred Lopez");
            assert.equal(
              res.text,
              "Thread validation failed: delete_password: Path `delete_password` is required."
            );
            done();
          });
      });
      test("invalid post (missing all field)", function(done) {
        chai
          .request(server)
          .post(`/api/threads/${board}`)
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.text,
              "Thread validation failed: text: Path `text` is required., delete_password: Path `delete_password` is required."
            );
            done();
          });
      });
    });

    suite("GET", function() {
      test("get board", function(done) {
        chai
          .request(server)
          .get(`/api/threads/${board}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);

            //setting for future test
            latestThreadId = res.body[0]._id;

            done();
          });
      });
    });

    suite("DELETE", function() {
      test("Delete Invalid Data", function(done) {
        chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({
            thread_id: "",
            delete_password: ""
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, "Uncaught AssertionError");
            done();
          });
      });
      test("Delete Invalid delete_password", function(done) {
        chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({
            thread_id: latestThreadId,
            delete_password: ""
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });
      test("Delete valid data", function(done) {
        chai
          .request(server)
          .delete(`/api/threads/${board}`)
          .send({
            thread_id: latestThreadId,
            delete_password: testDeletePassword
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });

    suite("PUT", function() {});
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("reset valid post", function(done) {
        const postText = "valid post";
        chai
          .request(server)
          .post(`/api/threads/${board}`)
          .send({ text: postText, delete_password: testDeletePassword })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.header["x-powered-by"], "Wilfred Lopez");

            done();
          });
      });
      test("rest threatid", function(done) {
        chai
          .request(server)
          .get(`/api/threads/${board}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);

            //setting for future test
            latestThreadId = res.body[0]._id;

            done();
          });
      });
      test("reset valid post", function(done) {
        const postText = "valid reply";
        chai
          .request(server)
          .post(`/api/replies/${board}`)
          .send({
            text: postText,
            thread_id: latestThreadId,
            delete_password: testDeletePassword
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.header["x-powered-by"], "Wilfred Lopez");

            done();
          });
      });
    });

    suite("GET", function() {
      test("get one reply", function(done) {
        // /api/replies/{board}?thread_id={thread_id}.
        chai
          .request(server)
          .get(`/api/replies/${board}`)
          .query({
            thread_id: latestThreadId
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isArray(res.body[0].replies);
            assert.isDefined(res.body[0].board);
            assert.isDefined(res.body[0].text);
            assert.isDefined(res.body[0].created_on);
            assert.isDefined(res.body[0].bumped_on);
            assert.isUndefined(res.body[0].delete_password);
            replyID = res.body[0].replies[0]._id;
            done();
          });
      });
    });

    suite("PUT", function() {
      test("update valid reply", function(done) {
        chai
          .request(server)
          .put(`/api/replies/${board}`)
          .send({
            reply_id: replyID,
            thread_id: latestThreadId,
            delete_password: testDeletePassword
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");

            done();
          });
      });
      test("update invalid reply", function(done) {
        chai
          .request(server)
          .put(`/api/replies/${board}`)
          .send({
            reply_id: "sadasd",
            thread_id: latestThreadId,
            delete_password: testDeletePassword
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, "Uncaught AssertionError");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("delete invalid reply", function(done) {
        chai
          .request(server)
          .delete(`/api/replies/${board}`)
          .send({
            reply_id: "sadasd",
            thread_id: latestThreadId,
            delete_password: testDeletePassword
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, "Uncaught AssertionError");
            done();
          });
      });
      test("delete valid reply", function(done) {
        chai
          .request(server)
          .delete(`/api/replies/${board}`)
          .send({
            reply_id: replyID,
            thread_id: latestThreadId,
            delete_password: testDeletePassword
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });
  });
});
