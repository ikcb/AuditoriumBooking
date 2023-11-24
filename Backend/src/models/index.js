const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },

  email: {
    type: String,
    required: [true, "Please provide us your Email"],
    lowercase: true,
  },

  mobileno: {
    type: String,
    required: [true, "Please tell us your name"],
  },

  eventdescription: {
    type: String,
    required: [true, "Please provide us your Message"],
    lowercase: true,
  },
  date: {
    type: Date,
    required: [true, "Please provide us your Date"],
  },
  clubname: {
    type: String,
    required: [true, "Please provide us your Club Name"],
  },
  approve: {
    type: String,
    required: [true, "Please provide us your approval"],
  },
  file: {
    type: String,
    required: [true, "Please provide us your file"],
  },
  startTime: {
    type: String,
    required: [true, "Please provide us your Start Time"],
  },
  endTime: {
    type: String,
    required: [true, "Please provide us your End Time"],
  },
  status: {
    type: String,
    enum: ["pending", "declined", "booked"],
    default: "pending",
  },
});

const userSchemaRegistration = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchemaRegistration.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.JWT_SECRET
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log("the error part" + error);
  }
};

const Ticket = mongoose.model("Ticket", ticketSchema, "tickets");
const RegistrationUser = mongoose.model(
  "RegistrationUser",
  userSchemaRegistration,
  "registrationUsers"
);

module.exports = {
  Ticket,
  RegistrationUser,
};
