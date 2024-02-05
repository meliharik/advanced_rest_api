const Auth = require("../models/auth.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await Auth.findOne({ email });

    if (user) return res.status(500).json({ message: "User already exists" });

    if (password.length < 6)
      return res
        .status(500)
        .json({ message: "Password must be at least 6 characters" });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await Auth.create({
      username,
      email,
      password: passwordHash,
      isVerified: false,
    });

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    newUser.verificationCode = verificationCode;
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_TOKEN, {
      expiresIn: "1d",
    });

    // Nodemailer ile e-posta gönder
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "hosgeldin@uludag.app", // Gönderici e-posta adresi
      to: email, // Alıcı e-posta adresi
      subject: "E-posta Doğrulama",
      text: `E-posta doğrulama kodunuz: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "E-posta gönderimi başarısız. ${error}" });
      } else {
        console.log("E-posta gönderildi: " + info.response);
        res.json({
          message: "Kullanıcı oluşturuldu, e-posta doğrulama kodu gönderildi.",
          newUser,
          token,
        });
      }
    });

    // res.status(201).json({
    //    status: 'success',
    //    newUser,
    //    token
    // })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify email code
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await Auth.findOne({ email });
    if (user.verificationCode === verificationCode) {
      user.verified = true;
      await user.save();
      res.status(200).json({ message: "E-posta doğrulandı." });
    } else {
      res.status(500).json({ message: "E-posta doğrulama kodu hatalı." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email });

    if (!user) return res.status(500).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(500).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, verifyEmail };
