import express from "express"
import { Url } from "../models/urlModel.js"
import { User } from "../models/userModel.js"
import { profile } from "../models/profileModel.js"
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'







export const signup = async (req, res) => {
  try {

    let { name, email, password, mobileNo, confirmPassword, gender } = req.body;

    if (!name || !email || !password || !mobileNo || !confirmPassword || !gender) {
      return res.status(400).json({
        status: "failure",
        message: "All the fields are required",
        data: null,
      });
    }

    let EmailExists = await User.findOne({ email: email })

    if (EmailExists) {
      return res.status(400).json({
        status: "failure",
        message: "Email Allready exists",
        data: null,
      });
    }



    if (mobileNo.length != 10) {
      return res.status(400).json({
        status: "failure",
        message: "Please enter valid mobile no",
        data: null,
      });
    }


    if (password.length < 8) {
      return res.status(400).json({
        status: "failure",
        message: "Password must be of atleast 8 character",
        data: null,
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        status: "failure",
        message: "password and confirm password does not match",
        data: null,
      });
    }


    const round = 5

    let hashedPassword = bcrypt.hashSync(password, round);


    let userData = {
      name: name,
      email: email,
      mobileNo: mobileNo,
      gender: gender,
      password: hashedPassword,

    }


    try {
      const createUrl = await User.create(userData);
      const userObject = createUrl.toJSON();
      delete userObject.password

      return res.status(200).json({
        status: true,
        message: "User created successfully",
        data: userObject,
      });
    } catch (error) {

      return res.status(500).json({
        status: "failure",
        message: "Something went wrong",
        data: error || error.stack,
      });
    }

  } catch (error) {

    console.log(error)
  }


}


export const login = async (req, res) => {
  try {

    let { email, password } = req.body;

    let Userexists = await User.findOne({ email: email })

    console.log(Userexists)

    if (!Userexists) {
      return res.status(200).json({
        status: false,
        message: "Email does not exists",
        data: null,
      });
    }

    let ResObject = {
      userId: Userexists._id.toString(),
      name: Userexists.name,
      email: Userexists.email,
      userType: Userexists.userType
    }

    let HashedPassword = Userexists.password

    let PasswordMatch = bcrypt.compareSync(password, HashedPassword);

    if (PasswordMatch) {

      return res.status(200).json({
        status: true,
        message: "Logged in sucessfully",
        data: ResObject,
      });

    } else {

      return res.status(200).json({
        status: false,
        message: "password does not match",
        data: null,
      });
    }





  } catch (error) {

    console.log(error)
  }


}



export const addProfile = async (req, res) => {
  try {
    const { userId, name, bio, yogaExp, dailyGoal, totalYogasnas } = req.body;


    if (!userId || !name || !bio || !yogaExp || !dailyGoal || !totalYogasnas || !req.file) {
      return res.status(400).json({ status: false, message: "All fields are required!", data: null });
    }


    console.log("Uploaded File Details:", req.file);


    const serverUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;




    const profileData = {
      userId,
      name,
      bio,
      yogaExp,
      dailyGoal,
      totalYogasnas,
      image_url: imageUrl,
    };


    const newProfile = await profile.create(profileData);

    return res.status(201).json({
      status: true,
      message: "Profile created successfully!",
      data: newProfile
    });

  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};




