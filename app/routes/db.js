import app from "../app";
import pool from "../config/database";
import express from "express";
import {testConnection} from "../controllers/dbController";

const router = express.Router();

app.get('/test-db',testConnection);

module.exports = router;