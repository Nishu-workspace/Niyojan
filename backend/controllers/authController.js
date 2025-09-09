import User from "../models/User.js";
import bcrypt from "bcrypt";
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

    //TODO SEND EMAIL
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
export { registerUser, loginUser };
