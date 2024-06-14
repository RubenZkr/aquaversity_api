const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const db = require('../config/database');
const { getLevels, getProgress, getAnswers, getQuestions, getExamLoggedDetails, getLoggedAnswers, getLoggedQuestions} = require("../controllers/levelController");

const {
    getLevelDetails,
    getExamDetails,
    postAnswer
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

router.get('/progress', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.progress);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/level/:id', getLevelDetails)
router.get('/level/:id/Exam', getExamDetails)
router.post('/level/:id/Exam', postAnswer)
router.get('/level/', postAnswer)

router.get('/level/:id/answers', getAnswers)
router.get('/level/:id/questions', getQuestions)


router.get('/level/:id/Exam-plus',verifyToken, getExamLoggedDetails)
router.get('/level/:id/answers-plus', verifyToken,getLoggedAnswers)
router.get('/level/:id/questions-plus', verifyToken, getLoggedQuestions)




router.get("/all", getLevels);
router.get("/progress", authenticateToken, getProgress);

module.exports = router;
