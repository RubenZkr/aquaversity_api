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
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/message", postMessage);
router.get("/messages", getMessages);
router.post("/message/:id/like", verifyToken, like);
router.get("/message/:id/comments", verifyToken, getComments);
router.post("/message/:id/comment", verifyToken, postComment);

module.exports = router;
