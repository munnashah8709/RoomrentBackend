const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const connect = require("../RoomrentBackend/connection.js/connect");
const port = 8000;
var cors = require('cors');
app.use(express.json());
const userregistration = require("../RoomrentBackend/Model/RegisterSchema");
// const logingdatas = require("../oppsengineapp/model/loginschema");
const secret = "mynameismunnashahiamwithrahul";

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.post('/register', async (req, res) => {
  const { username, email, password, contact } = req.body;

  // Perform validation on the incoming data here...
  if (!email || !password || !username ||!contact) {
    return res.status(422).json({ error: "please add all the field" })
}

  try {
    // Check if the user already exists
    const existingUser = await userregistration.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new userregistration({
      username,
      email,
      password: hashedPassword,
      contact,
    });

    // Save the user to the database
    await newUser.save();

    // Return a success response
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});


app.post('/login', async (req, res) => {
    try {
      const{email,password}=req.body
      if (!email || !password ) {
          return res.status(422).json({ error: "please add email or password" })
      }
      userregistration.findOne({ email: email })
          .then((savedUser => {
              if (!savedUser) {
                  return res.status(422).json({ error: "inValid email or password" })
  }
  bcrypt.compare(password,savedUser.password)
  .then(doMatch=>{
      if(doMatch){
          // res.json({message:"User Sign in sucessfully"})
          const token=jwt.sign({_id:savedUser._id},secret)
          const{_id,name,email}=savedUser
          res.json({token,user:{_id,name,email}})
      }
      else{
          return res.status(422).json({ error: "inValid email or password" })
      }
  })
  .catch(err=>{
      console.log(err)
  })
  })) 
    }
     catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
