require("ejs");
require('dotenv').config();
const PORT = process.env.PORT || 3030;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const passport = require("passport");
const path = require('path');

//# Database and Model
const connectDB = require("./db/connect");
const User = require("./db/models/User")
const Price = require("./db/models/Price")

//# Routes
const adminRoute = require('./admin');
const { log } = require("console");

app.use('/admin', adminRoute);
app.use(express.json()); //! To parse the json data.(raw)
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); //! to parse the urlencoded data.(x-www-form-urlencoded)
app.use(session({
secret: process.env.SESSION_SECRET, //! This is the secret used to sign the session ID cookie.
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session()); 

//#--- LocalStrategy---//
passport.use(User.createStrategy());

//#---USER Serialization & De-Serialization---//
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//# GET - LOGIN
app.get("/", function(req,res) {

  if(req.isAuthenticated()){
    res.redirect("/laundrystatus");
  } else {
    res.render("customer/login");
  }
});

//# POST - LOGIN 
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/loginfailed' }),
  function(req, res) {
    console.log("Current logged in user: " + req.user.username); 
    res.redirect("/laundrystatus");
  });


//# GET - LOGIN FAILED
app.get('/loginfailed', (req, res) => {
  res.render('customer/loginfail')
})


//# GET - FORGOT PASSWORD | ENTER RECOVERY USERNAME
app.get('/enterusername', (req, res) =>{
  res.render("customer/recovery/enterUsername");
});

//# POST - FORGOT PASSWORD | FIND USER
app.post('/finduser', (req, res) => {
  const recoveryUsername = req.body.username;
  User.findOne({username: recoveryUsername}, (err, foundUser)=>{
    if(foundUser){
      res.render("customer/recovery/securityverification", 
      {userdata: {q: foundUser.recovery.securityquestion, a: foundUser.recovery.answer, id: foundUser.id}})
      //! we're passing q, a and id because q will be displayed as the security quesiton, a and id will be passed further to verify and find user and update password.
    } else res.redirect("/enterusername");
  })
});

//# POST - FORGOT PASSWORD | VERIFY USER & UPDATE PASSWORD
app.post("/resetpassword", (req, res) => {

  const {verificationanswer, newpassword, userAnswerAndID } = req.body;
  const {a, id} = JSON.parse(userAnswerAndID); 
  //! We're getting the answer and id of the user as JSON from securityverification ejs

  if(a === verificationanswer){
    User.findById(id, (err, foundUser) => {
      foundUser.setPassword(newpassword, (err, foundUser) => {
        if(!err){
          foundUser.save();
          res.redirect("/")
        } else console.log(err);
      })
    });
  } else {
    app.get('/invalidAnswer', (req, res) => {
      res.send({success: false})
    })
    res.send("Answer didn't Match!")
  }
})

//# GET - REGISTER
app.get("/register", function (req, res) {
  res.render("customer/register");
  });
  
//# POST - REGISTER
app.post("/register", function(req, res){
  //! Below code is from passport-local-mongoose
  User.register({ username: req.body.username }, req.body.password, function(err){
    if(err){
      console.log(err);
      res.redirect("/register");
    } else{
      passport.authenticate("local")(req, res, function(){
        const {fname, lname, phoneno, street, city, state, zipcode, securityquestion, answer} = req.body;
        console.log(securityquestion, answer);
        const loggedInUser = req.user.id;

        User.findById(loggedInUser, function(err, foundUser){
          if(err){
            console.log(err);
          } else if(foundUser){
            foundUser.fname = `${fname.charAt(0).toUpperCase()}${fname.substring(1, fname.length)}`;
            foundUser.lname = `${lname.charAt(0).toUpperCase()}${lname.substring(1, lname.length)}`;
            foundUser.phoneno = phoneno;
            foundUser.street = street;
            foundUser.city = city;
            foundUser.state = state;
            foundUser.zipcode = zipcode;
            foundUser.recovery.securityquestion = securityquestion;
            foundUser.recovery.answer = answer;
            foundUser.save(()=> {
              res.redirect("/createlaundryrequest");
            })
          };
        });
        console.log("New User Registered: " + req.user.username);
      })
    }
  })
  });

//# GET - LOGOUT
app.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { 
      console.log(err); 
    } else{
      res.redirect('/');
      console.log("User Logged out and this session ended: " + req.headers.cookie);
    }
  });
  });


//# GET - PROFILE
app.get("/profile", function(req, res){
  if(req.isAuthenticated()){
    const loggedinUser = req.user.id;
    User.findById(loggedinUser, function(err, foundUser){
      if(err){
        console.log(err);
      } else {
        res.render("customer/profile", {userDetails: foundUser})
      }
    })
  } else {
    res.redirect("/")
  }
})

//# POST - UPDATE PROFILE
app.post("/updateprofile", (req, res) => {
  const {id, fname, lname, phoneno, username, street, city, state, zipcode} = req.body;
  
  User.findById(id, function(err, foundUser){
    if(err){
      console.log(err);
    } else if(foundUser){
      foundUser.fname = `${fname.charAt(0).toUpperCase()}${fname.substring(1, fname.length)}`;
      foundUser.lname = `${lname.charAt(0).toUpperCase()}${lname.substring(1, lname.length)}`;
      foundUser.username = username;
      foundUser.phoneno = phoneno;
      foundUser.street = street;
      foundUser.city = city;
      foundUser.state = state;
      foundUser.zipcode = zipcode;

      foundUser.save(()=> {
        res.redirect("/profile");
      })
    };
  });
})

//# GET - CREATE LAUNDRY REQUEST
app.get("/createlaundryrequest", (req, res) => {
  req.isAuthenticated() ? res.render("customer/createLaundryRequest") : res.redirect("/");
})

//# POST - CREATE LAUNDRY REQUEST
app.post("/createlaundryrequest", (req, res) => {
  if(req.isAuthenticated()){
    const loggedInUsersID = req.user.id;
    User.findById(loggedInUsersID, function(err, foundUser){
      if(err){
        console.log(err);
      } else {
        //! Here we used spread operator to directly pass the req.body to user's new order object with status key added.
        foundUser.order.push({...req.body, status: "Pending"});
        foundUser.save(()=> {
          res.render("customer/requestSubmitted");
        })
      }
    })
  } 
  else res.redirect("/")
})


//# GET - LAUNDRY STATUS
app.get("/laundrystatus", (req, res) => {
  if(req.isAuthenticated()){
    const loggedInUserID = req.user.id;
    User.findById(loggedInUserID, (err, foundUser) => {
      res.render("customer/laundryStatus", {requests: foundUser.order});
    })
  } else {
    res.redirect("/")
  }
})

//# GET - PRICES
app.get("/prices", (req, res) => {
  if(req.isAuthenticated){
    Price.findById(process.env.PRICING_DOCUMENT_ID, (err, foundPricing) => {
      if(err){
        console.log(err);
      } else {
        res.render("customer/prices", {foundPricing})
      }
    })
  } else {
    res.redirect("/")
  }
})


app.listen(PORT, ()=> {
  connectDB();
  console.log("Listening on port " + PORT)});
