import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  units: {
    type: Number,
    required: true,
  },

  occupancy: {
    type: Number,
    required: true,
  },

  revenue: {
    type: Number,
    required: true,
  },

  image_url: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export const property = mongoose.model('propertySchema', propertySchema);

