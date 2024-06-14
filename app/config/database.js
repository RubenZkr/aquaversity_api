require("dotenv").config();

const mysql = require("mysql2/promise");


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});


module.exports = pool;

/*
user
Password1234!!!!
Aquaversity

CREATE DATABASE aquaversity;

SHOW DATABASES;

USE aquaversity;
CREATE TABLE users (
                      id VARCHAR(255) PRIMARY KEY,
                      email VARCHAR(255) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL,
                      role VARCHAR(255) DEFAULT 'user'
);


CREATE TABLE ForumPost (
                           id VARCHAR(255) PRIMARY KEY,
                           writtenByUserId VARCHAR(255),
                           text TEXT,
                           author VARCHAR(255),
                           title VARCHAR(255),
                           date DATE,
                           likes INT,
                           FOREIGN KEY (writtenByUserId) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE ForumReply (
                            id VARCHAR(255) PRIMARY KEY,
                            userId VARCHAR(255),
                            forumPostId VARCHAR(255),
                            text TEXT,
                            likes INT,
                            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (forumPostId) REFERENCES ForumPost(id) ON DELETE CASCADE
);


CREATE TABLE LikedReply (
                            userId VARCHAR(255),
                            replyId VARCHAR(255),
                            PRIMARY KEY (userId, replyId),
                            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (replyId) REFERENCES ForumReply(id) ON DELETE CASCADE
);
CREATE TABLE LikedPost (
                            userId VARCHAR(255),
                            postId VARCHAR(255),
                            PRIMARY KEY (userId, postId),
                            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (postId) REFERENCES ForumPost(id) ON DELETE CASCADE
);

CREATE TABLE UserForumPost (
                               userId VARCHAR(255),
                               forumPostId VARCHAR(255),
                               PRIMARY KEY (userId, forumPostId),
                               FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                               FOREIGN KEY (forumPostId) REFERENCES ForumPost(id) ON DELETE CASCADE
);

CREATE TABLE level (
                       id VARCHAR(255) PRIMARY KEY,
                       orderNumber INT NOT NULL,
                       content TEXT,
                       title VARCHAR(255),
                       isLockedForGuest BOOLEAN
);


CREATE TABLE completed_level (
                                 userId VARCHAR(255),
                                 levelId VARCHAR(255),
                                 completedOn DATE,
                                 PRIMARY KEY (userId, levelId),
                                 FOREIGN KEY (userId) REFERENCES users(id),
                                 FOREIGN KEY (levelId) REFERENCES Level(id)
);


CREATE TABLE examen_question (
                                 id VARCHAR(255) PRIMARY KEY,
                                 levelId VARCHAR(255),
                                 question TEXT,
                                 FOREIGN KEY (levelId) REFERENCES Level(id)
);


CREATE TABLE answer (
                        id VARCHAR(255) PRIMARY KEY,
                        questionId VARCHAR(255),
                        answer TEXT,
                        isCorrect BOOLEAN,
                        FOREIGN KEY (questionId) REFERENCES examen_question(id)
);

INSERT INTO Level (id, orderNumber, title, content, isLockedForGuest) VALUES
                                                                          (UUID(), 1, 'Level 1', 'Informatie 1', false),
                                                                          (UUID(), 2, 'Level 2', 'Informatie 2', false),
                                                                          (UUID(), 3, 'Level 3', 'Informatie 3', false),
                                                                          (UUID(), 4, 'Level 4', 'Informatie 4', true),
                                                                          (UUID(), 5, 'Level 5', 'Informatie 5', true),
                                                                          (UUID(), 6, 'Level 6', 'Informatie 6', true),
                                                                          (UUID(), 7, 'Level 7', 'Informatie 7', true),
                                                                          (UUID(), 8, 'Level 8', 'Informatie 8', true),
                                                                          (UUID(), 9, 'Level 9', 'Informatie 9', true);
                                                                          
INSERT INTO examen_question (id, levelId, question) VALUES
                                                        (UUID(), '1', 'Vraag 1'),
                                                        (UUID(), '1', 'Vraag 2'),
                                                        (UUID(), '1', 'Vraag 3'),
                                                        (UUID(), '2', 'Vraag 1'),
                                                        (UUID(), '2', 'Vraag 2'),
                                                        (UUID(), '2', 'Vraag 3'),
                                                        (UUID(), '3', 'Vraag 1'),
                                                        (UUID(), '3', 'Vraag 2'),
                                                        (UUID(), '3', 'Vraag 3');
                                                        
INSERT INTO answer (id, questionId, answer, isCorrect) VALUES
                                                          (UUID(), '1', 'Antwoord 1', true),
                                                            (UUID(), '1', 'Antwoord 2', false),
                                                            (UUID(), '1', 'Antwoord 3', false),
                                                            (UUID(), '2', 'Antwoord 1', false),
                                                            (UUID(), '2', 'Antwoord 2', true),
                                                            (UUID(), '2', 'Antwoord 3', false),
                                                            (UUID(), '3', 'Antwoord 1', false),
                                                            (UUID(), '3', 'Antwoord 2', false),
                                                            (UUID(), '3', 'Antwoord 3', true);
                                                            




select * from level;


*/

