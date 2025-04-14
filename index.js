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
const API_URL='https://api.openweathermap.org/data/2.5/forecast';
const API_KEY=process.env.API_KEY;


app.use(express.static('public'));
app.set('view engine', 'ejs');




app.get("/", async (req, res) => {
  try{
    const response= await axios.get(`${API_URL}?lat=46.0500268&lon=14.5069289&units=metric&appid=${API_KEY}`)
    const list= response.data.list;
    let weather=list[0].weather[0].main;
    let temp=list[0].main.temp;
    temp= `${temp}°C`;
    const city=response.data.city.name;
    const icon= list[0].weather[0].icon;
    const iconUrl=`https://openweathermap.org/img/wn/${icon}@2x.png`;
    
   
    const listData=response.data.list.slice(1,5);
    const hourData = listData.map(item => ({
      temp: item.main.temp,
      hour: item.dt_txt,
      icon: item.weather[0].icon
    }));
    
     
    res.render("index",{
      weather,
      temp,
      city,
      icon:iconUrl,
      hourData,
      userSearch: false
    });
  }

  catch (error){
    res.render("index", {
      weather: null,
      temp: null,
      city: null,
      icon: null,
      hourData: [],
      userSearch: false,
      error: JSON.stringify(error.response?.data || "An error occurred")
    });
  }
        
      });   
    

app.get('/submit', async (req, res) => {
 try{
  const cityName=req.query.city?.trim();
  const geoUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
  const geoResponse=await axios.get(geoUrl);
  if (geoResponse.data.length === 0) {
    return res.render("index", { error: "City not found." })};
  
  const lat=geoResponse.data[0].lat;
  const lon=geoResponse.data[0].lon;
  
  const response= await axios.get(`${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  
  const list= response.data.list;
  let weather=list[0].weather[0].main;
  let temp=list[0].main.temp;
  temp= `${temp}°C`;
  const city=response.data.city.name;
  const icon= list[0].weather[0].icon;
  const iconUrl=`https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  
  const listData=response.data.list.slice(1,5);
  const hourData = listData.map(item => ({
      temp: item.main.temp,
      hour: item.dt_txt,
      icon: item.weather[0].icon
}))
res.render("index", {
  weather,
  temp,
  city,
  icon: iconUrl,
  hourData,
  userSearch: true

})}
catch(error){
  res.render("index", {
    weather: null,
    temp: null,
    city: null,
    icon: null,
    hourData: [],
    userSearch: false,
    error: JSON.stringify(error.response?.data || "An error occurred")
  });
}});



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})