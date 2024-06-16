const db = require("../config/database");
const jwt = require('jsonwebtoken');
const uuid = require("uuid");

const getLevelDetails = async (req, res) => {
    try {
        const id = req.params.id;

        if (id === null) {
            return res.status(400).send({ message: "Bad request" });
        }

        const [rows] = await db.query('SELECT * FROM level WHERE id = ?', [id]);
        const levelData = rows[0];

        if (levelData.isLockedForGuest) {
            const token = req.cookies.token;

            if (!token) {
                return res.status(403).send({ message: "Access forbidden: no token provided" });
            }
        }

        // Send the level data if all checks pass
        res.status(200).send(levelData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error could not load level" });
    }
}


const getExamDetails = async (req,res) => {
    try{
        const levelId = req.params.id;
        console.log(levelId);

        if(levelId === null){
            res.status(400).send({message: "Bad request"})
        }

        const [rows] = await db.query('SELECT examen_question.question, a.id, a.answer FROM examen_question INNER JOIN answer a on examen_question.id = a.questionId WHERE examen_question.levelId = ?', [levelId]);
        const examQuestionData = rows

        if (examQuestionData.isLockedForGuest) {
            const token = req.cookies.token;

            if(!token){
                return res.status(403).send({ message: "Access forbidden: no token provided" });
            }

            try{
                jwt.verify(token, process.env.JWT_SECRET);
                res.status(200).send(examQuestionData);
            }catch (err){
                return res.status(403).send({ message: "Access forbidden: invalid token" });
            }
        }
        res.status(200).send(examQuestionData);
    }
    catch (error){
        console.error(error);
        res.status(500).send({ message: "Error could not load exam" });
    }
}



const getAnswers = async (req,res) => {
    try{
        const id = req.params.id;
        console.log(id);

        if(id === null){
            res.status(400).send({message: "Bad request"})
        }

        const [rows] = await db.query('SELECT * FROM answer WHERE questionId = ?', [id]);
        res.status(200).send(rows);

    }
    catch (error){
        console.error(error);
        res.status(500).send({ message: "Error could not load exam" });
    }
}


const postAnswers = async (req,res) => {
    try{
        const answers = req.body.answers;

        const questionCount = Object.keys(answers).length;

        // validate question count with the database question count per level
        const [rows] = await db.query('SELECT COUNT(*) AS count FROM examen_question WHERE levelId = ?', [req.params.id]);
        if (rows[0].count !== questionCount) {
            return res.status(400).send({ message: `Invalid input: expected ${rows[0].count} answers` });
        }

        const answerIds = Object.values(answers);
        let correctCount = 0

        for (const answerId of answerIds) {
            const [rows] = await db.query('SELECT isCorrect FROM answer WHERE id = ?', [answerId]);

            if(rows[0].isCorrect){
                correctCount++;
            }

        }
        let score = correctCount/questionCount * 10;

        // round the score
        score = Math.round(score * 100) / 100;

        const levelId = req.params.id;

        const token = req.cookies.token;
        const userId = token ? jwt.verify(token, process.env.JWT_SECRET).id : null;

        if(score >= 8 && userId !== null){
            const [rows] = await db.query('SELECT * FROM completed_level WHERE userId = ? AND levelId = ?', [userId, levelId]);

            if(rows.length === 0){
                await db.query('INSERT INTO completed_level (userId, levelId, completedOn) VALUES (?, ?, ?)', [userId, levelId, new Date()]);
            }
        }

        res.status(200).send({score: score});

    }catch (error){
        console.error(error);
        res.status(500).send({ message: "Error could not post answer" });
    }
}



//module.exports = {getLevelDetails, getExamDetails, postAnswer};const db = require("../config/database");

// GET levels
const getLevels = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM level ORDER BY orderNumber");

        const token = req.cookies.token;
        const userId = token ? jwt.verify(token, process.env.JWT_SECRET).id : null;

        if (userId !== null) {
            const [completedLevels] = await db.query("SELECT levelId FROM completed_level WHERE userId = ?", [userId]);

            rows.forEach(row => {
                // check if the level is completed by the user
                if (completedLevels.some(completedLevel => completedLevel.levelId === row.id) || row.orderNumber === 1 || row.orderNumber === 2 || row.orderNumber === 3) {
                    row.isCompleted = true;
                } else {
                    row.isCompleted = false;
                }
            });

            rows.forEach((row, index) => {
                // unlock the next level if the previous one is completed
                if (index > 0 && rows[index - 1].isCompleted) {
                    row.isUnlocked = true;
                } else if (index === 0) {
                    row.isUnlocked = true; // First level is always unlocked
                } else {
                    row.isUnlocked = false;
                }
            });
        } else {
            rows.forEach(row => {
                if (row.orderNumber === 1 || row.orderNumber === 2 || row.orderNumber === 3) {
                    row.isCompleted = true;
                    row.isUnlocked = true;
                } else {
                    row.isCompleted = false;
                    row.isUnlocked = false;
                }
            });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching levels:", error);
        res.status(500).send({ message: "Error fetching levels" });
    }
};

// GET progress
const getProgress = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    if (id === null) {
      res.status(403).message({ message: "UnAuthorized access" });
    }
    const [rows] = await db.query(
      "SELECT l.orderNumber, cl.completedOn FROM completed_level cl JOIN Aquaversity.level l ON l.id = cl.levelId WHERE cl.userId = ?",
      [id]
    );
    console.log(rows);
    res.status(200).json(rows);
  } catch (error)
  {
    res.status(500).json({ message: "Seasda" });
  }
};

const getLoggedAnswers = async (req,res) => {
}
const getLoggedQuestions = async (req,res) => {
}
const getExamLoggedDetails = async (req,res) => {

}

const patchLevelContent = async (req, res) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //get user from db
        const user = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);

        if (user[0].role !== "admin") {
            return res.status(403).send({ message: "Access forbidden: not an admin" });
        }
        const id = req.params.id;
        const { content } = req.body;
        if (id === null || content === null) {
            res.status(400).send({ message: "Bad request" });
        }
        await db.query("UPDATE level SET content = ? WHERE id = ?", [content, id]);
        res.status(200).send({ message: "Level content updated successfully" });
    } catch (error) {
        console.error("Error updating level content:", error);
        res.status(500).send({ message: "Server error" });
    }
}
const getQuestions = async (req,res) => {
    try{
        const id = req.params.id;
        const [rows] = await db.query(`SELECT q.id AS question_id, q.question, a.id AS answer_id, a.answer, a.isCorrect
                                       FROM examen_question q
                                                JOIN answer a ON q.id = a.questionId
                                       WHERE q.levelId = ?`, [id]);
        const questions = {};
        rows.forEach(row => {
            if (!questions[row.question_id]) {
                questions[row.question_id] = {
                    id: row.question_id,
                    question: row.question,
                    answers: []
                };
            }
            questions[row.question_id].answers.push({
                id: row.answer_id,
                answer: row.answer
            });
        });

        res.status(200).send(Object.values(questions));

    }
    catch (error){
        console.error(error);
        res.status(500).send({ message: "Error could not load exam" });
    }
}

const createQuestions = async (req, res) => {
    try{
        const questions = req.body.questions;
        const levelId = req.params.id;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Invalid input: questions must be a non-empty array' });
        }

        // get all questions and answers from the database and delete them
        const [rows] = await db.query('SELECT id FROM examen_question WHERE levelId = ?', [levelId]);
        const questionIds = rows.map(row => row.id);
        if (questionIds.length > 0) {
            await db.query(`DELETE FROM answer WHERE questionId IN (${questionIds.map(() => '?').join(',')})`, questionIds);
            await db.query('DELETE FROM examen_question WHERE levelId = ?', [levelId]);
        }

        for (const question of questions) {
            const questionId = uuid.v4();

            await db.query('INSERT INTO examen_question (id, levelId, question) VALUES (?, ?, ?)', [questionId, levelId, question.question]);

            for (const answer of question.answers) {
                const answerId = uuid.v4();

                await db.query('INSERT INTO answer (id, questionId, answer, isCorrect) VALUES (?, ?, ?, ?)', [answerId, questionId, answer.answer, answer.isCorrect]);
            }
        }
        
        return res.status(201).json({ message: 'Questions created successfully' });
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error creating questions' });
    }

}

const editQuestions = async (req, res) => {

}




module.exports = { getLevels, getProgress, getLevelDetails, getExamDetails, postAnswers, getAnswers, getQuestions,getLoggedAnswers,getLoggedQuestions,getExamLoggedDetails,patchLevelContent,createQuestions};
