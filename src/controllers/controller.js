import express from "express"
import { Url } from "../models/urlModel.js"
import { User } from "../models/userModel.js"
import { profile } from "../models/profileModel.js"
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises';
import path from 'path'
import {  ObjectId } from 'mongodb' 







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
    const { userId, name, bio, yogaExp, dailyGoal, totalYogasnas, difficulty } = req.body;


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
      difficulty
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



export const updateProfile = async (req, res) => {
  try {
    const { userId, name, bio, yogaExp, dailyGoal, totalYogasnas, difficulty } = req.body;

    console.log(req.body)


    if (!userId || !name || !bio || !yogaExp || !dailyGoal || !totalYogasnas || !req.file || !difficulty) {
      return res.status(400).json({ status: false, message: "All fieldsss are required!", data: null });
    }

    console.log("Uploaded File Details:", req.file);


    const serverUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;



   let updateUser= await  profile.findOneAndUpdate(
      { userId: userId }, 
      { $set: { name: name,bio:bio,yogaExp:yogaExp,dailyGoal:dailyGoal,totalYogasnas:totalYogasnas,difficulty:difficulty,imageUrl }},
      { returnDocument: "after" } // Returns the updated document
  );
  
   




    if (updateUser) {
      return res.status(201).json({
        status: true,
        message: "Profile created successfully!",
        data: updateUser
      });

    } else {
      return res.status(201).json({
        status: true,
        message: "Something went wrong!",
        data: null
      });

    }

  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};



export const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;


    if (!userId) {
      return res.status(400).json({ status: false, message: "All fields are required!", data: null });
    }


    let ProfileDetails = await profile.findOne({ userId: userId })


    console.log(ProfileDetails)



    return res.status(201).json({
      status: true,
      message: "Profile data fetched sucessfully!",
      data: ProfileDetails
    });

  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};


export const getYogaPostById = async (req, res) => {
  try {
    const { userId } = req.body; // Get user ID from request body

    // Fetch user profile based on userId
    let ProfileDetails = await profile.findOne({ userId: userId });

    if (!ProfileDetails) {
      return res.status(404).json({ status: false, message: "User profile not found" });
    }

    let ProfileData = ProfileDetails.difficulty;

    // Define difficulty mapping
    let difficulty;
    if (ProfileData === "m") {
      difficulty = "intermediate";
    } else if (ProfileData === "e") {
      difficulty = "beginner";
    } else if (ProfileData === "h") {
      difficulty = "advanced";
    } else {
      return res.status(400).json({ status: false, message: "Invalid difficulty value" });
    }

    // Read the yoga poses JSON file
    const filePath = path.resolve('yoga.json');
    const data = await fs.readFile(filePath, 'utf-8');

    // Parse JSON data
    const yogaPoses = JSON.parse(data).yogaPoses;

    // Filter yoga poses based on difficulty level
    const filteredPoses = yogaPoses.filter(pose => pose.difficulty === difficulty);

    if (!filteredPoses.length) {
      return res.status(404).json({ status: false, message: "No yoga poses found for this difficulty level" });
    }

    res.status(200).json({ status: true, data: filteredPoses });

  } catch (error) {
    console.error("Error fetching yoga pose:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};



