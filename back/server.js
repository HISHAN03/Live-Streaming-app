const express = require('express');
const stream = require('stream');
const app = express();
const cors = require("cors");
const port = 3100;
const http = require('http').Server(app);
const { spawn } = require('node:child_process');

const io = require('socket.io')(http,{
  cors:
  {
    origin: 'http://localhost:3000', 
    allowedHeaders: ["Content-Type"],
    credentials: true, 
  }
});
const corsOptions = {
  origin: 'http://localhost:3000',
  allowedHeaders: ["Content-Type"],
  credentials: true,  
};
app.use('/youtube', cors(corsOptions));

const NodeMediaServer = require('node-media-server');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);
const nmsConfig = {
  rtmp: {
    port: 1935, // RTMP port
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
    // Disable pre-publish authentication
    auth: {
      play: false,
      publish: false,
    },
  },
  http: {
    port: 8000, 
    allow_origin: '*',
  },
};

const nms = new NodeMediaServer(nmsConfig);
nms.run()
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




let youtubeURL = '';
let youtubeID = '';
let iid='';

app.post('/youtube', (req, res) => {
  const requestData = req.body;
  youtubeURL = requestData.streamId;
  youtubeID = requestData.ingestionUrl;
  iid=requestData.iid;
console.log(youtubeURL)
console.log(youtubeID)
console.log(iid)
  res.json({ message: 'Data received successfully', data: requestData });
});

//const rtmpurl1='rtmp://a.rtmp.youtube.com/live2/x79t-hwtc-wjsc-vhwd-ajwe'
var ops = [
  "-i",
  "-",
  //force to overwrite
  "-c:v",
  "libx264",
  "-preset",
  "veryfast",
  "-tune",
  "zerolatency",
  "-vf",
  "scale=w=-2:0",
  ////'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
  ////'-strict', 'experimental',
  //"-bufsize",
  //"1000",
  "-f",
  "flv",
  "rtmp://a.rtmp.youtube.com/live2/x79t-hwtc-wjsc-vhwd-ajwe",
];

io.on('connection', (socket) => {

  const ffmpeg1 = spawn("ffmpeg", ops);
  console.log('A client connected');
  socket.on("videoFrame", (frameData) => {
    console.log('Frames received successfully');

  // const rtmpUrl = `${youtubeID}/${iid}`;
  //   console.log(rtmpUrl)
    // const frameStream = new stream.PassThrough();
    // frameStream.end(frameData);
    ffmpeg1.stdin.write(frameData);
    // const ffmpegCommand = ffmpeg()
    //   .input(frameStream)
    //   .outputOptions('-vf', 'scale=-2:720')
    //   .format('flv')
    //   .toFormat('flv')
    //   .output(rtmpUrl);

    // const videoStream = ffmpegCommand.pipe();
    
    // videoStream.on('data', (data) => {
    //   socket.emit('videoData', data);
    // });

    ffmpegCommand.on('end', () => {
      console.log('Video conversion to FLV complete');
      socket.emit("framesReceived");
    });

    ffmpegCommand.on('error', (err) => {
      console.error('Error converting video to FLV:', err);
      // Handle the error appropriately
    });

    // ffmpegCommand.run();
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});



const mongoose = require("mongoose");
mongoose
.connect(process.env.MONGO_URL)
.then(() => {
  console.log("mongodb-connected");
})
.catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});

















// const corsOptions = {
//   credentials: true,
//   origin: ["http://localhost:3000"], 
//   allowedHeaders: ["Content-Type"],
// };



// app.use(cors(corsOptions));
// app.get("/profile", (req, res) => {
//   const token = req.cookies?.token;
//   if (token) {
//     jwt.verify(token, jwtSecret, {}, (err, userData) => {
//       if (err) console.log(err);
//       res.json(userData);
//       console.log("profile-connected")
//     });}
//      else {
//     res.status(401).json("no token");
//     console.log("profile-NOT-connected")
//     }});


    
// app.post('/signup', async (req, res) => {
//   let { username, password } = req.body;

//   try {
//     let isUser = await User.findOne({ username });

//     if (isUser) {
//       return res.status(401).json({ message: "Username already exists" });
//     }

//     let user = new User({ username, password });
//     await user.save();

//     jwt.sign({ name: username }, jwtSecret, {}, (err, token) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json("Error signing token");
//       } else {
//         res
//           .cookie("token", token, { sameSite: "none", secure: true })
//           .status(201)
//           .json({ id: user._id, message: "Account created successfully" });
//         }
//         window.location.reload(); 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json("Internal Server Error");
//   }
// });




// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const foundUser = await User.findOne({ username });
//   if (foundUser) {
//     jwt.sign(
//       { name: username },
//       jwtSecret,
//       {},
//       (err, token) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({ message: "Error signing token" });}
//         res.cookie("token", token, { sameSite: "none", secure: true }).json({
//           id: foundUser._id,
//           message: "Login successful", 
//         });
//       }
//     );
//   } else {
//     res.status(401).json({ message: "Invalid credentials" });
//   }
// });

  
  // app.get('/people', async (req,res) => {
  //   const users = await User.find({}, {'_id':1,username:1});
  //   res.json(users);
   
  // }
  
  
  // );


  http.listen(port, () => console.log(`Listening on port ${port}`));




