const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB(); //connected to db
app.get("/", (req, res) => res.send("Server responding to API"));

// Init middleware
app.use(express.json({ extended: false }));

// define routes

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// concurrently makes server and client  server to run by one command only
