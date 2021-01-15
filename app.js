const express = require('express')
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');

const path = require("path");
const exphbs = require("express-handlebars");

const app = express()

const User=require("./models/User")



const db ='mongodb+srv://@password:online@cluster0.wkx7c.mongodb.net/User?retryWrites=true&w=majority'


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

app.post('/login', (req, res) => {
  User.findOne({ "email": req.body.email}, async (err, user) => {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (isMatch) {
            console.log('Successful login')
              console.log(user)
              
          }
      })



  })




  res.redirect('/')
})




app.get("/register", function(req, res) {
  res.render((path.join(__dirname+'/public/views/register')), { layout: false });
})
app.get("/enquiry", function(req, res) {
  res.sendFile(path.join(__dirname+"/public/views/enquiry.html"))
})



app.post('/register', async (req, res) => {
  bcrypt.genSalt(10, function (err, Salt) {   
     bcrypt.hash(req.body.password, Salt, function (err, hash) {
          var user = new User({   
              username: req.body.username,
              email: req.body.email,
              occupation: req.body.occupation,
              age:req.body.age,
              password: hash
          })

          user.save().then(() => { 
              console.log(user)
          })
      })
  })
res.redirect('/')
})











app.listen(5000, () => {
    console.log('Server listening at port 5000')
})
