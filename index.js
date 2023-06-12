const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const connect = require("../RoomrentBackend/connection.js/connect");
const port = 8000;
app.use(express.json());
const userregistration = require("../RoomrentBackend/Model/RegisterSchema");
// const logingdatas = require("../oppsengineapp/model/loginschema");
const secret = "mynameismunnashahiamwithrahul";

app.post('/register', async (req, res) => {
  const { username, email, password, contact, DateOfBirth, AlternetPhone, FatherName, MotherName, PanNumber, PanImage, VotercardImage, AadharNumber, AadharImage, profilePik } = req.body;

  // Perform validation on the incoming data here...
  if (!email || !password || !username ||!contact ||!FatherName ||!MotherName ||!PanImage ||!PanNumber ||!VotercardImage ||!AadharImage ||!AadharNumber ||!DateOfBirth) {
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
      DateOfBirth,
      AlternetPhone,
      FatherName,
      MotherName,
      PanNumber,
      PanImage,
      VotercardImage,
      AadharNumber,
      AadharImage,
      profilePik
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
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await userregistration.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, secret);
  
      // Return the token as a response
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
