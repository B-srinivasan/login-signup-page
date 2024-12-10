var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

// Create app
const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true })); // for form data (x-www-form-urlencoded)
app.use(bodyParser.json()); // for JSON payloads
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve static files (e.g., HTML, CSS, JS)

// MongoDB connection for signup and login databases
const signupDB = mongoose.createConnection("mongodb://localhost:27017/signupDB");
signupDB.on("error", () => console.log("Error connecting to Signup Database"));
signupDB.once("open", () => console.log("Connected to Signup Database"));

const loginDB = mongoose.createConnection("mongodb://localhost:27017/loginDB");
loginDB.on("error", () => console.log("Error connecting to Login Database"));
loginDB.once("open", () => console.log("Connected to Login Database"));

// Define User Schema for Signup DB
const signupUserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createpassword: { type: String, required: true },
  password: { type: String, required: true },
});
const SignupUser = signupDB.model("User", signupUserSchema);

// Define User Schema for Login DB
const loginUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});
const LoginUser = loginDB.model("User", loginUserSchema);

// Serve homepage (index.html)
app.get("/", (req, res) => {
  res.set({ "Allow-access-Allow-Origin": "*" });
  res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
});

// Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { name, createpassword, password } = req.body;

    // Check if passwords match
    if (createpassword !== password) {
      return res.status(400).send("Passwords do not match❌");
    }

    // Check if user already exists
    const userExists = await SignupUser.findOne({ name });
    if (userExists) {
      return res.status(400).send("User already exists❌");
    }

    // Create new user with hashed password (bcrypt)
    const newUser = new SignupUser({ name, createpassword, password });

    // Save new user to the database
    await newUser.save();

    return res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if both name and password are provided
    if (!name || !password) {
      return res.status(400).send("Name and Password are required❌");
    }

    // Fetch the user from the signup database
    const user = await SignupUser.findOne({ name });
    if (!user) {
      console.log("Login attempt failed: User not found");
      return res.status(404).send("User not found❌");
    }

    // Compare the password
    if (user.password === password) {
      console.log("Login successful for user:", user.name);

      // Save login attempt in the login database
      const loginUser = new LoginUser({ name, password });
      await loginUser.save();

      // Serve the user.html file
      return res.sendFile(path.resolve(__dirname, "../frontend", "user.html"));
    } else {
      console.log("Login attempt failed: Incorrect password");
      return res.status(401).send("Invalid Password!❌");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("An error occurred during login❌");
  }
});

// Start the server
app.listen(3011, () => {
  console.log("Server started on port 3011");
});
