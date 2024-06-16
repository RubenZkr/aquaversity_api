const express = require("express");
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const {
  register,
  login,
  getUsers,
  getRole,
  getLoggedInStatus,
  logout,
  deleteUser,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");
const { get } = require("express/lib/response");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/all", getUsers);
router.delete("/:id/delete", verifyToken, deleteUser);
router.get("/role", verifyToken, getRole);
router.get("/status", getLoggedInStatus);
router.get("/profile", verifyToken, (req, res) => {
  // Profile endpoint logic here
});

router.get("/user", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await db.query("SELECT email from users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/user", authenticateToken, async (req, res) => {
  const { email, password } = req.body;
  const userId = req.user.id;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    let newEmail = users[0].email;
    let newPassword = users[0].password;

    if (email) newEmail = email;
    if (password) newPassword = await bcrypt.hash(password, 10);

    await db.query("UPDATE users SET email = ?, password = ? WHERE id = ?", [
      newEmail,
      newPassword,
      userId,
    ]);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
