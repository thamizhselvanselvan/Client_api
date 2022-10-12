// localhost run ----

// import express, { request, response } from 'express';
// import mongoose from 'mongoose';

// const app = express();

// app.use(express.json());

// app.use('/try',(request,response)=>{
//     // request.status(200).json({message:'method is running successfully'})
//     response.status(200).json(request.body)
// })

// app.listen(3030,() =>{console.log("Successed on running...")})



//server create -----

import express, { request, response } from "express";
import mongoose from "mongoose";
import users from "./customer.js";

const app = express();
app.use(express.json());

var Connection_string =
  "mongodb://127.0.0.1:27017/users?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4";

app.use("/createcustomer", async (request, response) => {
  var customerData = await users.create({
    email:"abi@gmail.com",
    password:9484,
    age:21,
    address:"kovai"

  });
  response.status(200).json(customerData);
});


// insert many
app.use("/insertMany", async (request, response) => {
  var customerData = await users.insertMany([
    {email:"ram@gmail.com",password:3934,age:25,address:"chennai"},
    {email:"riya@gmail.com",password:5874,age:35,address:"madurai"},
  ]);
  response.status(200).json(customerData);
});


//  update
app.use("/update", async (request, response) => {
  var customerData = await users.updateOne({email:"abi@gmail.com"},{$set:{age:20}});
  response.status(200).json(customerData);
});


//  update many
app.use("/updateMany", async (request, response) => {
  var customerData = await users.updateMany({},{$set:{age:20}});
  response.status(200).json(customerData);
});


// delete api
app.use("/delete", async (request, response) => {
  var customerData = await users.remove({email:"riya@gmail.com"});
  response.status(200).json(customerData);
});



// selectall ----

app.use("/getdata", async (request, response) => {
  var customerData = await users.find();
  response.status(200).json(customerData);
});


// selectone ---

app.use("/gettingsingleledata", async (request, response) => {
//   console.log(request);
  let data = await users.find({
    cname: request.body.name,
  });
  response.status(200).json(data);
});


// updateOne ----

app.put('/updateone', async(req, res) => {
    try {
        const data = await users.updateOne(
            {cid:req.params.cid}, {
            cname: req.body.cname
        });
        console.log(data)

        res.send({ msg: "Group Updated!!!" })

    } catch (err) {
        console.error(err.message);
        res.sendStatus(400).send('Server Error');
    }
});


// app.use("/updateone/:id", async (request, response) => {
//   try {
//     await customer.updateOne(
//       { cid: request.params.cid },
//       {
//         $set: {
//           cname: request.body.cname,
//         }
//       }
//     )
//     var updatedres = await customer.find({_id:req.params.id})
//     res.send(updatedres)
//   } catch (error) {
//     response.status(400).json(error.message);
//   }
// });


// login check ----

app.use("/login", async (request, response) => {
  let data = await users.findOne({
    $and: [
      { mobilenumber: request.body.mobilenumber },
      { cname: request.body.cname },
    ],
  });
  if (data) {
    response.status(200).json({ message: "Login success", status: 1 });
  } else {
    response.status(200).json({ message: "Login failes", status: 0 });
  }
});


// resetpswd -----

app.use("/resetpswd", async (request, response) => {
    let data = await users.updateOne(
        { email: request.params.email },
        // { oldpassword: request.params.oldpassword},
        {
          $eelmMatch :[{
            oldpassword: request.body.oldpassword,
            password: request.body.password,
            confirmpassword: request.body.confirmpassword,

          }],
          $set:[{
            newpassword:request.body.newpassword

          }]
        
        }
      );
      
    //   if(data.password === data.confirmpassword){
    //     newpassword:request.body.newpassword,

    //   }
    if (data) {
      response.status(200).json({ message: "password changed", status: -1 });
    } else {
      response.status(200).json({ message: "failed", status: 0 });
    }
  });

// app.post("/reset",function(req,res){
//     customer.findByUsername(req.body.email).then(function(exixstdUser){
//     if (exixstdUser){
//         exixstdUser.setPassword(req.body.password, function(){
//             exixstdUser.save();
//             req.flash("success","password resetted");
//                 // res.redirect("/login");
//         });
//     } else {
//         req.flash("error","User doesnt exist");
//                 // res.redirect("/reset");
//     }
//     },function(err){
//         console.log(err);res.redirect("/");
//     });
    
//     });


//Logout-----

app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
  });



  mongoose
  .connect(Connection_string)
  .then(() => {
    app.listen(7474, () => {
      console.log("running success");
    });
  })
  .catch((error) => {
    console.log(error);
  });




