const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true 
  },
  mobileno: { 
    type: String, 
    required: true 
  },
  eventdescription: { 
    type: String, 
    required: true, 
    lowercase: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  clubname: { 
    type: String,
    default: null
  },
  requestType: { 
    type: String, 
    enum: ["club", "teacher"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "forwarded", "booked", "declined"], 
    default: "pending" 
  },
  approvedBy: { 
    type: String, 
    enum: ["sub-admin", "super-admin", null], 
    default: null 
  },
  file: { 
    type: String 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
});

const userSchemaRegistration = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ["super-admin", "sub-admin", "user"],
    required: true,
    default: "user"
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d' 
    }
  }],
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
});

userSchemaRegistration.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { 
        _id: this._id.toString(),
        role: this.role,
        email: this.email
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

    if (this.tokens.length >= 5) {
      this.tokens.shift(); 
    }

    this.tokens.push({ 
      token: token,
      createdAt: new Date()
    });

    this.lastLogin = new Date();
    await this.save();
    return token;
  }
  catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Unable to generate authentication token");
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
