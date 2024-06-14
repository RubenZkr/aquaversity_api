const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const db = require("../config/database");


const router = express.Router();

router.get("/route", (req, res) => {
    res.send("Test route");
});

router.get("/user", async (req, res) => {
    try {
        const users = await db.query("SELECT * FROM users");

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});


module.exports = router;
