import express from "express"
import { Url } from "../models/urlModel.js"
import { User } from "../models/userModel.js"
import { property } from "../models/propertyModel.js"
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'






export const signup = async (req, res) => {
  try {

    let { name, email, password, mobileNo, confirmPassword,gender } = req.body;

    if (!name || !email || !password || !mobileNo || !confirmPassword||!gender) {
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
      gender:gender,
      password: hashedPassword,
     
    }


    try {
      const createUrl = await User.create(userData);
      const userObject = createUrl.toJSON();
      delete userObject.password

      return res.status(200).json({
        status: "success",
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

    if (!Userexists) {
      return res.status(200).json({
        status: false,
        message: "Email does not exists",
        data: null,
      });
    }

    let ResObject = {
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



export const addProperty = async (req, res) => {
  try {
    const { title, address, totalUnits, occupancy, revenue } = req.body;

    
    if (!title || !address || !totalUnits || !occupancy || !revenue || !req.file) {
      return res.status(400).json({ status: false, message: "All fields are required!", data: null });
    }

    
    console.log("Uploaded File Details:", req.file);


    const serverUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;

   

    
    const propertyData = {
      title,
      address,
      units:totalUnits,
      occupancy,
      revenue,
      image_url: imageUrl, 
    };

    
    const newProperty = await property.create(propertyData);

    return res.status(201).json({
      status: true,
      message: "Property created successfully!",
      data: newProperty
    });

  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};


export const getProperties = async (req, res) => {
  try {

    const properties = await property.find().sort({ createdAt: -1 }).exec(); 


    if (!properties || properties.length === 0) {
      return res.status(404).json({ status: false, message: "No properties found", data: [] });
    }

    return res.status(200).json({
      status: true,
      message: "Properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};


export const getPropertyCount = async (req, res) => {
  try {

    const properties = await property.find().sort({ createdAt: -1 }).exec(); 


    if (!properties || properties.length === 0) {
      return res.status(404).json({ status: false, message: "No properties found", data: [] });
    }

    return res.status(200).json({
      status: true,
      message: "Properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const properties = await property.find().exec();

    if (!properties || properties.length === 0) {
      return res.status(404).json({ status: false, message: "No properties found", data: {} });
    }

    const totalProperties = properties.length;
    const totalUnits = properties.reduce((sum, prop) => sum + (prop.units || 0), 0);
    const totalOccupancy = properties.reduce((sum, prop) => sum + (prop.occupancy || 0), 0);

    const averageOccupancy = totalProperties > 0 ? (totalOccupancy / totalProperties).toFixed(2) : 0;

    return res.status(200).json({
      status: true,
      message: "Property statistics fetched successfully",
      data: {
        totalProperties,
        totalUnits,
        averageOccupancy: `${averageOccupancy}%`,
      },
    });
  } catch (error) {
    console.error("Error fetching property statistics:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params; // Get property ID from request parameters

    if (!id) {
      return res.status(400).json({ status: false, message: "Property ID is required" });
    }

    const deletedProperty = await property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ status: false, message: "Property not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Property deleted successfully",
      data: deletedProperty,
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};



