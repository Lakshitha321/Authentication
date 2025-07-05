import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { response } from "express";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  if(!name || !email || !password) {
    return res.json({success: false, message: "Please fill all fields"});
  }
try{
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword });
      await user.save();  

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' ,
         maxAge: 7 * 24 * 60 * 60 * 1000
      });
       //sending welcome email
       const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Our Service",
        text: `Welcome.Your account has been created with email id`,
      }
      await transporter.sendMail(mailOptions);
        
       return res.json({ success: true});
   
}catch(error) {
  res.json({success: false,message: "An error occurred while registering the user"});
}
}
export const login = async (req, res) =>
    {
  const { email, password } = req.body;
    if(!email || !password) {
      return res.json({ success: false, message: "Please fill all fields" });

    }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true});

  }catch (error) {
    return res.json({ success: false, message: "An error occurred while logging in" });
  }

} 
export const logout = async (req,res)=> {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })
    return res.json({ success: true, message: "Logged out successfully" });
  }catch (error) {
    return res.json({ success: false, message: "Error Messege" });
  }
}

export const sendVeryOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify Your Account",
      text: `Your verification OTP is ${otp}. It is valid for 24 hours.`,
    }
    await transporter.sendMail(mailOptions);

    res.json ({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    return res.json({ success: false, message: "An error occurred while sending OTP" });
  }
}

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Please provide userId and OTP" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.verifyOtp === ' ' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if(user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
    
  } catch (error) {
    return res.json({ success: false, message: "An error occurred while verifying email" });
  }
}
// check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.json({ success: false, message: "An error occurred while checking authentication" });
  }
}

//send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Please provide an email" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It is valid for 15 minutes.`,
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "Reset OTP sent successfully" });

  }catch (error) {
    return res.json({ success: false, message: "An error occurred while sending reset OTP" });
  }
}

//Reset User password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if(!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Please provide email, OTP and new password" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if( user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();
    response.json({ success: true, message: "Password reset successfully" });
    
} catch (error) {
    return res.json({ success: false, message: "An error occurred while resetting password" });
  }
}