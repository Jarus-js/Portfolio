const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  company: { type: String },
  website: { type: String },
  location: { type: String },
  status: { type: String, required: true }, //level of job description
  skills: { type: [String], required: true },
  bio: { type: String },
  githubusername: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  //EXPERIENCE
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String }
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = model("profile", profileSchema);
