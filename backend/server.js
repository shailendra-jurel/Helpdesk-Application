
import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";


const app = express();
app.use(cors());

app.get("/", (req, res) => { 
  res.send("Hello World!");
});

app.listen(3000, () => {

  console.log("Server is running on port 3000");

});
