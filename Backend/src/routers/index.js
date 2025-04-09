const express = require("express");
const router = new express.Router();
const User = require("../models");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const { log } = require("console");
const saltRounds = 10;

router.post("/createticket", async (req, res) => {

  try {
    const {
      name,
      email,
      mobileno,
      eventdescription,
      date,
      clubname,
      requestType,
      file,
      startTime,
      endTime,
    } = req.body;
    if (!name || !email || !mobileno || !eventdescription || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "Please fill up all fields"});
  }
    const ticket = new User.Ticket({
      name,
      email,
      mobileno,
      eventdescription,
      date,
      clubname: requestType === "club" ? clubname : null,
      requestType,
      status: "pending",
      approvedBy: null,
      file,
      startTime,
      endTime,
    });
    await ticket.save();

    res.status(201).json(ticket);
    // res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create a ticket" });
  }
});

// Route to update ticket status
router.put("/updateticket/:ticketId", auth(["sub-admin", "super-admin"]), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const ticket = await User.Ticket.findById(ticketId);
    // console.log(req.body);
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (req.user.role === "sub-admin") {
      if (!["booked", "declined", "forwarded"].includes(status)) {
        return res.status(400).json({ error: "Invalid status for sub-admin" });
      }
      if (status === "forwarded") {
        ticket.status = "pending";
        ticket.approvedBy = "sub-admin";
      } else {
        ticket.status = status;
        ticket.approvedBy = "sub-admin";
      }
    }

    if (req.user.role === "super-admin") {
      if (!["booked", "declined"].includes(status)) {
        return res.status(400).json({ error: "Super-admin can only approve or decline" });
      } else {
        ticket.status = status;
        ticket.approvedBy = "super-admin";
      }
    }

    await ticket.save();
    res.json({ message: "Ticket updated successfully", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});


// Route to check the status of a ticket
router.get("/ticket", async (req, res) => {
  try {
    const { status } = req.query;
    console.log(req.query);
    if (!status) {
      const tickets = await User.Ticket.find({});
      // console.log(tickets)
      return res.json(tickets);
    }
    const allowedStatuses = ["booked", "declined", "pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const tickets = await User.Ticket.find({ status });
    // console.log(tickets)
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.post("/Adminregister", async (req, res) => {
  const { email, username, password, role} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.RegistrationUser.create({
      email,
      username,
      password: hashedPassword,
      role: role,
    });
    res.send("Registration Successfully");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).send("Registration failed");
  }
});

router.post("/Adminlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.RegistrationUser.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).send("Incorrect password");

    const token = await user.generateAuthToken();
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Login failed");
  }
});

module.exports = router;
