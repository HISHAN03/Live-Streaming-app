const express = require('express');
const app = express();
const port = 3010; // You can change this port number if needed
const cors = require("cors");



const corsOptions = {
    credentials: true,
    origin: ["https://localhost:3000" ],
    allowedHeaders: ["Content-Type"]
  };
  app.use(cors(corsOptions));



// Basic route
app.post('/login', (req, res) => {
    res.send('Hello, this is the basic Express backend!');
  });










app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
