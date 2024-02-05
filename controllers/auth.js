const Auth = require('../models/auth.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async(req, res) => {
   try{
      const { username, email, password } = req.body;
      const user = await Auth.findOne({ email });

      if(user) return res.status(500).json({ message: 'User already exists' });

      if(password.length < 6) return res.status(500).json({ message: 'Password must be at least 6 characters' });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = await Auth.create({
         username,
         email,
         password: passwordHash
      });

      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_TOKEN, { expiresIn: '1d' });

      res.status(201).json({
         status: 'success',
         newUser,
         token
      })

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

const login = async(req, res) => {
   try{
      const { email, password } = req.body;
      const user = await Auth.findOne({ email });

      if(!user) return res.status(500).json({ message: 'User does not exist' });

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) return res.status(500).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, { expiresIn: '1d' });

      res.status(200).json({
         status: 'success',
         user,
         token
      })

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

module.exports = { register, login };