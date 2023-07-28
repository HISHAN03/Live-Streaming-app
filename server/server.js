const express = require("express");
const app = express();
const port = 3010;
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./schema/userModel");
const jwt = require("jsonwebtoken");
dotenv.config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongodb-connected");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"], // Allow requests from this origin (frontend URL)
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
app.use(express.json());

const secretKey = "your_secret_key"; // Change this to a secure secret key

// Signup route
app.post('/signup', (req, res) => {
  let { username, password } = req.body;
  let isUser = User.find(user => user.username == username);
  if (!isUser) {
    let user = { username, password };
    user.push(user);
   jwt.sign({ name:username },jwtSecret,{},(err, token) => {
      if (err) 
      {
        console.log(err);
        res.status(500).json("Error signing token");
      } else 
      {
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({ id: createdUser._id });
      }
    }
  );
  }
  else { res.status(401).json({ message: "username already exists" });}})


app.post('/login', (req, res) => 
{
  let { username, password } = req.body;
  let user = User.find(user => user.username == username);
  if (!user) return res.status(404).json({ message: "User Not Found" });
  let pass = user.find(user => user.password == password);
  if (!pass) return res.status(401).json({ message: "Invalid Password" });
jwt.sign({ name:username },jwtSecret,{},(err, token) => {
      if (err) 
      {
        console.log(err);
        res.status(500).json("Error signing token");
      } else 
      {
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({ id: createdUser._id });
      }
    }
  );
})


app.listen(port, () => { console.log(`Server is running on http://localhost:${port}`); });




