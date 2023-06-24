const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("./db/models/User")

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

//! Why is there a function here?

function dashboard(res){

  User.find({"order": {$ne: null}}, function(err, foundUsers){
    if(err){
      console.log(err);
    } else if(foundUsers){
    //! Here we're going over each foundUser and checking if the order is not zero in length if Yes(not zero), it will execute the right side operand of the AND operator and push the fullname and order array to orders array.

      let orders = []
      foundUsers.forEach(user => {
        user.order.length !== 0 
        && 
        orders.push({
          id: user.id,
          customerName: user.fullname,
          order: user.order
        })
      });

      return res.render("admin/dashboard", {orders: orders})
      
    } else {
      return res.send("No Order Found")
    }
  })
};

//# GET - ADMIN ROUTE 
    router.get('/', (req, res) => {
      res.render("admin/password")
    });
  
    router.post('/dashboard', (req, res) => {
      const password = req.body.password;

      if(password === process.env.ADMIN_PASSWORD){
        dashboard(res);  //# DASHBOARD FUNCTION HAS BEEN CALLED HERE
      } else {
        res.send("Incorrect Password!")
      }
    });


//# POST - UPDATE STATUS
    router.post("/updatestatus", (req, res) => {

      const {ids, status} = req.body;
      const {userID, orderID} = JSON.parse(ids);


    User.findOneAndUpdate(
      {
        _id: userID, 
        'order._id': orderID 
      },
      {
        $set: {
          'order.$.status': status 
        }
      },
      { new: true }, 
      (err, updatedUser) => {
        if (err) {
          console.error(err);
        } else {
          updatedUser.save();
          dashboard(res); //# DASHBOARD FUNCTION HAS BEEN CALLED HERE
        }
      }
    );
  });
  
module.exports = router;