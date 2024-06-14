const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const forumRoutes = require("./routes/forum");
const cookieParser = require("cookie-parser");

// Import routes
const levelsRoutes = require("./routes/levels");
const db = require("./config/database");

// Initialize express app
const app = express();

app.use(cookieParser());

app.use(express.json());
// Use helmet to secure Express headers
app.use(helmet());
// Enable CORS with various options
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.get('/test-db', async (req, res) => {
  await db.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      return res.status(500).json({error: error.message});
    }
    res.json({solution: results[0].solution});
  });
});

app.use(cors(corsOptions));
// HTTP request logger middleware
app.use(morgan("dev"));
// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base route
app.use("/", levelsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/levels",levelsRoutes);
app.use("/api/level",levelsRoutes);
app.use("/api/progress",levelsRoutes);
app.use("/api/forum",forumRoutes);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send("404: Page not found");
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("500: Internal Server Error");
});

module.exports = app;
