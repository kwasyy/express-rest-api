const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");
const cors = require("cors");
const path = require("path");
const socket = require("socket.io");

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});
const io = socket(server);

app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});

const testimonialsRoutes = require("./routes/testimonials.routes");
const seatsRoutes = require("./routes/seats.routes");
const concertsRoutes = require("./routes/concerts.routes");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", testimonialsRoutes);
app.use("/api", seatsRoutes);
app.use("/api", concertsRoutes);

io.on("connection", (socket) => {
  console.log("New socket!");
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found..." });
});