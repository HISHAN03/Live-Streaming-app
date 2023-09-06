const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http);
const cors = require("cors");

const corsOptions = {
  origin: `http://localhost:3000`, 
  allowedHeaders: ["Content-Type"],
  credentials: true, 
};
app.use(cors(corsOptions));




const port = 3100;
const dotenv = require("dotenv");
const User = require("./schema/userModel");
const jwt = require("jsonwebtoken");
const jwtSecret="reifberuifbwuief";
const apiKey=process.env.API_KEY;
const dgram = require("dgram");
const apiUrl = "https://www.googleapis.com/youtube/v3";
const { google } = require("googleapis");
const youtube = google.youtube({ version: "v3",auth: apiKey,});
dotenv.config();
app.use(express.json());



io.on('connection', (socket) => {
  console.log('a user connected');
});



const mongoose = require("mongoose");
mongoose
.connect(process.env.MONGO_URL)
.then(() => {
  console.log("mongodb-connected");
})``
.catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});

















// const corsOptions = {
//   credentials: true,
//   origin: ["http://localhost:3000"], 
//   allowedHeaders: ["Content-Type"],
// };



// app.use(cors(corsOptions));
app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) console.log(err);
      res.json(userData);
      console.log("profile-connected")
    });}
     else {
    res.status(401).json("no token");
    console.log("profile-NOT-connected")
    }});


    
app.post('/signup', async (req, res) => {
  let { username, password } = req.body;

  try {
    let isUser = await User.findOne({ username });

    if (isUser) {
      return res.status(401).json({ message: "Username already exists" });
    }

    let user = new User({ username, password });
    await user.save();

    jwt.sign({ name: username }, jwtSecret, {}, (err, token) => {
      if (err) {
        console.log(err);
        return res.status(500).json("Error signing token");
      } else {
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({ id: user._id, message: "Account created successfully" });
        }
        window.location.reload(); 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});




app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    jwt.sign(
      { name: username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error signing token" });}
        res.cookie("token", token, { sameSite: "none", secure: true }).json({
          id: foundUser._id,
          message: "Login successful", 
        });
      }
    );
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

  
  app.get('/people', async (req,res) => {
    const users = await User.find({}, {'_id':1,username:1});
    res.json(users);
   
  });


app.listen(port, () => { console.log(`Server is running on http://localhost:${port}`); });




