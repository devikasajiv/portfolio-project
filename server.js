const express = require("express");
const path = require("path");
const db = require("./db"); // this is your MySQL connection
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Contact POST route
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) return res.status(400).send("All fields required");

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) return res.status(500).send("Database error");

    // Optional: email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_app_password"
      }
    });

    const mailOptions = {
      from: "your_email@gmail.com",
      to: "devvika.sajiv@gmail.com",
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log("Email sent: " + info.response);
    });

    res.send("Message sent successfully!");
  });
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
