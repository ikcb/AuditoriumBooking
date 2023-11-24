const express = require("express");
const router = new express.Router();
const User = require("../models");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
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
      approve,
      file,
      startTime,
      endTime,
    } = req.body;
    if (
      !name ||
      !email ||
      !mobileno ||
      !eventdescription ||
      !date ||
      !clubname ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({ error: "Please fill up all fields" });
    }
    const ticket = new User.Ticket({
      name,
      email,
      mobileno,
      eventdescription,
      date,
      clubname,
      approve,
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
router.put("/updateticket/:ticketId", auth, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["booked", "declined"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const ticket = await User.Ticket.findById(ticketId);
    if (ticket.status === "pending") {
      ticket.status = status;
      await ticket.save();
      res.json(ticket);
    } else {
      return res
        .status(400)
        .json({ error: "Ticket already booked or declined" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
});

// Route to check the status of a ticket
// GET /ticket?status=booked
router.get("/ticket", async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      const tickets = await User.Ticket.find({});
      return res.json(tickets);
    }
    const allowedStatuses = ["booked", "declined", "pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const tickets = await User.Ticket.find({ status });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.post("/Adminregister", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.RegistrationUser.create({
      email,
      username,
      password: hashedPassword,
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
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = await user.generateAuthToken();
        res.send({ token });
      } else {
        res.status(400).send("Login failed");
      }
    } else {
      res.status(400).send("Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Login failed");
  }
});

module.exports = router;
