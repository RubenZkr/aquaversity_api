const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const db = require("../config/database");


const router = express.Router();

router.get("/route", (req, res) => {
    res.send("Test route");
});


module.exports = router;
