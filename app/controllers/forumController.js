const db = require("../config/database");
const uuid = require("uuid");
// POST forum message
const postMessage = async (req, res) => {
  try {
    const { title, text, date } = req.body.message;

    const token = req.cookies.token;

    let author = req.user.email;
    console.log(author);
    if (!token) {
      author = "Anonymous";
    }
    console.log(author);

    const writtenByUserId = req.user.id;
    const id = uuid.v4();
    const likes = 0;

    //Incorrect date value: '11-6-2024' for column 'date' at row 1 from mysql
    const newdate = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (!writtenByUserId || !text) {
      return res.status(400).json({ message: "content is required" });
    }

    const [result] = await db.query(
      "INSERT INTO forumpost (id, writtenByUserId, text, author, title, date, likes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, writtenByUserId, text, author, title, newdate, likes]
    );
    // return created message object as json response

    const [rows] = await db.query("SELECT * FROM forumpost WHERE id = ?", [id]);
    res
      .status(201)
      .json({ message: "Message posted successfully", message: rows[0] });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ message: "Error posting message" });
  }
};

// GET all forum messages
const getMessages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM forumpost");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// POST forum reply
const postReply = async (req, res) => {
  try {
    const { userId, forumPostId, text, likes } = req.body;

    if (!userId || !forumPostId || !text) {
      return res
        .status(400)
        .json({ message: "userId, forumPostId and text are required" });
    }

    const [result] = await db.query(
      "INSERT INTO forumreply (userId, forumPostId, text, likes) VALUES (?, ?, ?, ?)",
      [userId, forumPostId, text, likes || 0]
    );
    res
      .status(201)
      .json({ message: "Reply posted successfully", replyId: result.insertId });
  } catch (error) {
    console.error("Error posting reply:", error);
    res.status(500).json({ message: "Error posting reply" });
  }
};

// GET all replies for a specific forum post
const getReplies = async (req, res) => {
  try {
    const { postId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM forumreply WHERE forumPostId = ?",
      [postId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ message: "Error fetching replies" });
  }
};

const like = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    //check if user has already liked the post
    const [rows1] = await db.query(
      "SELECT * FROM likedpost WHERE userId = ? AND postId = ?",
      [userId, id]
    );
    if (rows1.length > 0) {
      // dislike the post
      await db.query("DELETE FROM likedpost WHERE userId = ? AND postId = ?", [
        userId,
        id,
      ]);
    } else {
      const [result] = await db.query(
        "INSERT INTO likedpost (userId, postId) VALUES (?, ?)",
        [userId, id]
      );
    }

    //set liked count of post to the amount the id is in the likedpost table
    const [rows] = await db.query(
      "SELECT COUNT(*) FROM likedpost WHERE postId = ?",
      [id]
    );
    await db.query("UPDATE forumpost SET likes = ? WHERE id = ?", [
      rows[0]["COUNT(*)"],
      id,
    ]);

    // return liked boolean and likes count
    const [rows2] = await db.query(
      "SELECT * FROM likedpost WHERE userId = ? AND postId = ?",
      [userId, id]
    );
    res.json({ liked: rows2.length > 0, likes: rows[0]["COUNT(*)"] });
  } catch (error) {
    console.error("Error liking message:", error);
    res.status(500).json({ message: "Error liking message" });
  }
};

const getComments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM forumreply WHERE forumPostId = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

const postComment = async (req, res) => {
  try {
    const newId = uuid.v4();
    const userId = req.user.id;
    const { id } = req.params;
    const { comment } = req.body;
    const likes = 0;

    if (!userId || !id || !comment) {
      return res
        .status(400)
        .json({ message: "userId, forumPostId and text are required" });
    }

    const [result] = await db.query(
      "INSERT INTO forumreply (id, userId, forumPostId, text, likes) VALUES (?,?, ?, ?, ?)",
      [newId, userId, id, comment, likes || 0]
    );
    res.status(201).json({ message: "Comment posted successfully" });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Error posting comment" });
  }
};

module.exports = {
  postMessage,
  getMessages,
  postReply,
  getReplies,
  like,
  getComments,
  postComment,
};
