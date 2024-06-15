const express = require("express");
const {
  getHomePage,
  getLevels,
  getProgress,
} = require("../controllers/levelController");
const authenticateToken = require("../middlewares/authMiddleware");
const {
  postMessage,
  getMessages,
  like,
  getComments,
  postComment,
} = require("../controllers/forumController");
const router = express.Router();

router.post("/message", postMessage);
router.get("/messages", getMessages);
router.post("/message/:id/like", authenticateToken, like);
router.get("/message/:id/comments", authenticateToken, getComments);
router.post("/message/:id/comment", authenticateToken, postComment);

module.exports = router;
