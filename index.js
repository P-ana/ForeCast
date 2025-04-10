import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

//Loading enviroment variables
dotenv.config();

const app=express();
/*process.env is a built-in Node.js object that stores environment variables.
After using dotenv.config(), it loads everything from your .env file into process.env.*/
const port=process.env.PORT || 3000;
const API_URL='https://api.openweathermap.org/data/2.5/weather';
const API_KEY=process.env.API_KEY;


app.use(express.static('public'));
app.set('view engine', 'ejs');

const config = {
    headers: {
      "x-api-key": `${API_KEY}`
    }
  };


app.get("/", (req, res) => {
        res.render("index", { content: "Waiting for data..." });
      });   
    





app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});