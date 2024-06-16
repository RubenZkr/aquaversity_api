const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const db = require('../config/database');
const { getLevels, getProgress, getAnswers, getQuestions
} = require("../controllers/levelController");
const {
    getLevelDetails,
    getExamDetails,
    postAnswers,
    patchLevelContent,
    createQuestions
} = require("../controllers/levelController")
const verifyToken = require("../middlewares/authMiddleware");



// GET home page
router.get('/', (req, res) => {
    res.send('Welcome to My Backend App!');
});

router.get('/levels', async  (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM level');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching level:', error);
        res.status(500).send({ message: 'Error fetching level' });
    }
});

router.get('/level/:id', getLevelDetails)
router.get('/level/:id/Exam', getExamDetails)
router.post('/level/:id/Exam', postAnswers)

router.get('/level/:id/answers', getAnswers)
router.get('/level/:id/questions', getQuestions)


router.patch('/level/:id',verifyToken, patchLevelContent)
router.post('/level/:id/questions',verifyToken, createQuestions)

router.get("/all", getLevels);
router.get("/progress", verifyToken, getProgress);

module.exports = router;
