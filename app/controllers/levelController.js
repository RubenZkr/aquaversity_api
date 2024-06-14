const db = require("../config/database");
const jwt = require('jsonwebtoken'); 

const getLevelDetails = async (req, res) => {
    try{
        const id = req.params.id;
        console.log(id);

        if(id === null){
            res.status(400).send({message: "Bad request"})
        }

        const [rows] = await db.query('SELECT * FROM level WHERE id = ?', [id]);
        const levelData = rows[0]

        if (levelData.isLockedForGuest) {
            const token = req.cookies.token;
            
            if(!token){
                return res.status(403).send({ message: "Access forbidden: no token provided" });
            }

            try{
                jwt.verify(token, process.env.JWT_SECRET);
                res.status(200).send(levelData);
            }catch (err){
                return res.status(403).send({ message: "Access forbidden: invalid token" });
            }       
        }
        res.status(200).send(levelData);
    } 
    catch (error) {
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
                answer: row.answer,
                isCorrect: row.isCorrect
            });
        });

        res.status(200).send(Object.values(questions));
        
        
        
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

const postAnswer = async (req,res) => {
    try{
        const answerId = req.params.id;

        if(answerId === null){
            res.status(400).send({message: "Bad request"})
        }

        const [rows] = await db.query('SELECT ExQu.levelId, a.isCorrect, l.isLockedForGuest FROM answer a INNER JOIN examen_question ExQu on a.questionId = ExQu.id INNER JOIN level l on ExQu.levelId = l.id WHERE a.id = ?', answerId)
        const answerData = rows[0]

        if(answerData.isLockedForGuest) {
            const token = req.cookies.token;

            if(!token){
                return res.status(403).send({ message: "Access forbidden: no token provided" });
            }

            try{
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id
                
                //const date = new Date();
                //const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                console.log("DATE: ", formattedDate)
                if(answerData.isCorrect){
                    console.log("Answer is correct" + answerData.isCorrect)

                    const [rows] = await db.query('INSERT INTO completed_level (userId, levelId, completedOn) VALUES (?,?,CURRENT_DATE)', [userId, answerData.levelId])
                    res.status(200).send({ message: true });
                }else{
                    res.status(200).send({ message: false });
                }

            }catch (err){
                return res.status(403).send({ message: "Access forbidden: invalid token" });
            }
        }else{
            const token = req.cookies.token;
            console.log(token)

            if(!token){
                if (answerData.isCorrect) {
                    res.status(200).send({ message: true });
                }else{
                    res.status(200).send({ message: false });
                }
            } else {
                if(answerData.isCorrect){
                    console.log("Answer is correct" + answerData.isCorrect)
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const userId = decoded.id

                    const [rows] = await db.query('INSERT INTO completed_level (userId, levelId, completedOn) VALUES (?,?,CURRENT_DATE)', [userId, answerData.levelId])
                    res.status(200).send({ message: true });
                }else{
                    res.status(200).send({ message: false });
                }
            }
        }



    }catch (error){
        console.error(error);
        res.status(500).send({ message: "Error could not post answer" });
    }
}



//module.exports = {getLevelDetails, getExamDetails, postAnswer};const db = require("../config/database");

// GET levels
const getLevels = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM level");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching level:", error);
    res.status(500).send({ message: "Error fetching level" });
  }
};

// GET progress
const getProgress = async (req, res) => {
  try {
    const id = req.user.id;
    if (id === null) {
      res.status(403).message({ message: "UnAuthorized access" });
    }
    const [rows] = await db.query(
      "SELECT l.orderNumber, cl.completedOn FROM completed_level cl JOIN Aquaversity.level l ON l.id = cl.levelId WHERE cl.userId = ?",
      [id]
    );
    console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getLoggedAnswers = async (req,res) => {
}
const getLoggedQuestions = async (req,res) => {
}
const getExamLoggedDetails = async (req,res) => {

}


module.exports = { getLevels, getProgress, getLevelDetails, getExamDetails, postAnswer, getAnswers, getQuestions,getLoggedAnswers,getLoggedQuestions,getExamLoggedDetails};
