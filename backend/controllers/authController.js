import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email address alrady in use",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      name,
      password: hashPassword,
    });

    const verficationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    await Verification.create({
      userId: newUser._id,
      token: verficationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    //send mail
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verficationToken}`;

    const emailBody = `<p>Click <a href=${verificationLink}>Here</a> to verify your email</p>`;
    const emailSubject = "Verify your email";
    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    console.log("email sent? ", isEmailSent);
    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    return res.status(201).json({
      message:
        "Verfication email sent to you. Please Check and verify your account",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.isEmailVerified) {
      const existingVerification = Verification.findOne({ userId: user._id });
      if (existingVerification && existingVerification.expiresIn > new Date()) {
        return res.status(400).json({
          message:
            "Email not verified yet, please check your email for verification.",
        });
      } else {
        await Verification.findByIdAndDelete(existingVerification._id);

        const verificationToken = jwt.sign(
          { userId: user._id, purpose: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiresIn: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const emailBody = `<p>Click <a href=${verificationLink}>Here</a> to verify your email</p>`;
        const emailSubject = "Verify your email";
        const isEmailSent = await sendEmail(email, emailSubject, emailBody);
        console.log("email sent? ", isEmailSent);
        if (!isEmailSent) {
          return res.status(500).json({
            message: "Failed to send verification email",
          });
        }

        return res.status(201).json({
          message:
            "Verfication email sent to you. Please Check and verify your account",
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      message: "Login Successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, purpose } = payload;
    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });
    if (!verification) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    const isTokenExpired = verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({
        message: "Token Expired",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "Token Expired",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified.",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const resetPasswordRequest = async (req, res) => {
  try{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).json({ message: "User not found" });
    }
    if(!user.isEmailVerified){
      return res.status(400).json({ message: "Email not verified yet. Please verify your email first..." });
    } 

    const existingVerification = await Verification.findOne({ userId: user._id });
    if(existingVerification && existingVerification.expiresAt > new Date()){
      return res.status(400).json({ message: "A reset password link has already been sent to your email. Please check your email." });
    }

    if(existingVerification && existingVerification.expiresAt < new Date()){
      await Verification.findByIdAndDelete(existingVerification._id);
    }

    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    )

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const emailBody = `<p>Click <a href=${resetPasswordLink}>Here</a> to reset your password. This link is valid for 15 minutes only.</p>`;
    const emailSubject = "Reset your password";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if(!isEmailSent){
      return res.status(500).json({ message: "Failed to send reset password email. Please try again later." });
    }
  }
  catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try{
    const { token, newPassword, confirmPassword } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(!payload){
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;
    if(purpose !== "reset-password"){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verification = await Verification.findOne({ userId, token });
    if(!verification){
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();

    if(isTokenExpired){
      return res.status(401).json({ message: "Token Expired" });
    }
    const user = await User.findById(userId);
    if(!user){
      return res.status(401).json({ message: "Unauthorized" });
    }
    if(newPassword !== confirmPassword){
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    await Verification.findByIdAndDelete(verification._id);
    return res.status(200).json({ message: "Password reset successfully" });
    
  } catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, verifyEmail, resetPasswordRequest, verifyResetPasswordTokenAndResetPassword };
