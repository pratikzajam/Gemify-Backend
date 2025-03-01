import {mongoose,Schema} from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    required: true,
  },

  yogaExp: {
    type: Number,
    required: true,
  },

  dailyGoal: {
    type: Number,
    required: true,
  },

  totalYogasnas: {
    type: String,
    required: true,
  },

  image_url:{
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export const profile = mongoose.model('profileSchema', profileSchema);

