const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require('uuid');
require("dotenv").config();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};
const getLoggedInStatus = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { role } = decoded;
    if (!token) {
      res.status(200).send({ loggedIn: false});
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(200).send({ loggedIn: false, role: role });
        } else {
          res.status(200).send({ loggedIn: true, role: role });
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error checking login status" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error logging out" });
  }
}

const getRole = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {id} = decoded;
    
    // get user role from the database
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const user = users[0];
    
    // Return the user role or any other relevant information
    res.status(200).json({ role:  user.role }); // For now hard coded. we need to get this from the database
  } catch (error) {
    console.error(error);
    res.status(401).send({ message: "Invalid token" });
  }
};

const getUsers = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const {id} = jwt.verify(token, process.env.JWT_SECRET);
    // if user is admin then continue
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const user = users[0];
    if (user.role !== "admin") {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const [allUsers] = await db.query("SELECT * FROM users");
    res.status(200).send(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching users" });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    // generate uuid
    const id = uuid.v4();


    const [result] = await db.query(
      "INSERT INTO users (id ,email, password) VALUES (?, ?, ?)",
      [id, email, hashedPassword]
    );
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("login failed - missing credentials");
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      console.log("login failed - user not found");
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("login failed - password mismatch");
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    console.log("login successful");

    const options = {
      maxAge: 1000 * 60 * 50, // expire after 50 minutes
      httpOnly: true, // Cookie will not be exposed to client side code
      sameSite: "none", // If client and server origins are different
      secure: true, // use with HTTPS only
    };

    res.cookie("token", token, options);
    res.status(200).json({ token });
  } catch (error) {
    console.error("login failed - server error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};


const deleteUser = async (req, res) => {

  const token = req.cookies.token;
  const {id} = jwt.verify(token, process.env.JWT_SECRET);
  // if user is admin then continue
  const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  const user = users[0];
  if (user.role !== "admin") {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error deleting user" });
  }
}
// Additional methods for password reset and profile management would be similar in handling DB and encryption tasks.
module.exports = { register, login, logout,getUsers, getRole, getLoggedInStatus, deleteUser };
