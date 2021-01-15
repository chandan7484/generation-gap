const express = require('express')
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');

const path = require("path");
const exphbs = require("express-handlebars");

const app = express()





const db ='mongodb+srv://@password:online@cluster0.wkx7c.mongodb.net/User?retryWrites=true&w=majority'









mongoose
.connect(
  
  db,
  {  
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
     useCreateIndex: true
  }

)
.then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname+"/public")));

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('views',path.join( __dirname, "views"));
app.set('view engine', '.hbs');





app.use('/user', require('./routes/user'));


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname+"/public/views/home.html"))
})
app.get("/home", function(req, res) {
  res.sendFile(path.join(__dirname+"/public/views/home2.html"))
})
app.get("/login", function(req, res) {
  res.render((path.join(__dirname+'/public/views/login')), { layout: false });
})
app.get("/register", function(req, res) {
  res.render((path.join(__dirname+'/public/views/register')), { layout: false });
})
app.get("/enquiry", function(req, res) {
  res.sendFile(path.join(__dirname+"/public/views/enquiry.html"))
})





app.listen(5000, () => {
    console.log('Server listening at port 5000')
})
