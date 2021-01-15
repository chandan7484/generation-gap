const express = require('express')
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');

const path = require("path");
const exphbs = require("express-handlebars");

const app = express()

const User=require("./models/User")
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(API_KEY)
// const db ='mongodb://localhost:27017/glorifydb'
const db ='mongodb+srv://@password:online@cluster0.wkx7c.mongodb.net/User?retryWrites=true&w=majority'

mongoose.connect(db,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('MongoDB Connected....'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname+"/public")));

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('views',path.join( __dirname, "views"));
app.set('view engine', '.hbs');





app.use('/user', require('./routes/user'));


app.get("/", function(req, res) {
  res.render((path.join(__dirname+"/public/views/home")),{layout:false});
})


app.get("/login",(req,res)=>{
  res.render((path.join(__dirname+'/public/views/login')), { layout: false });
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




  res.redirect('/after_login')
})
app.get("/after_login", function(req, res) {
  res.render((path.join(__dirname+'/public/views/home2')), { layout: false });
})



app.get("/register", function(req, res) {
  res.render((path.join(__dirname+'/public/views/register')), { layout: false });
})
app.get("/enquiry", function(req, res) {
  res.render((path.join(__dirname+"/public/views/enquiry")), { layout: false });
})
app.get("/about", function(req, res) {
  res.render((path.join(__dirname+"/public/views/about")), { layout: false });
})
app.get("/aboutL", function(req, res) {
  res.render((path.join(__dirname+"/public/views/aboutL")), { layout: false });
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
res.redirect('/login')
})

app.post('/enquiry',(req,res)=>{
  const msg = {
    to: 'hackingnitp@gmail.com', // Change to your recipient
    from: 'nitphack@gmail.com', // Change to your verified sender
    subject: 'A new enquiry posted regarding '+req.body.subject+'.',
    text: 'An enquiry has been posted by '+req.body.name+'. The question of concern is '+req.body.question+' .Please try to reach out to him/her using the email '+req.body.email+'.'
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
console.log(req.body.email)
  const msg2 = {
    to: req.body.email, // Change to your recipient
    from: 'nitphack@gmail.com', // Change to your verified sender
    subject: 'Regarding your enquiry',
    text: 'Thank you for posting your query. We will try answering it soon.',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
  .send(msg2)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

res.redirect('/after_login')
})









app.listen(5000, () => {
    console.log('Server listening at port 5000')
})
