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

    res.status(201).json({
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
export { registerUser, loginUser, verifyEmail };
