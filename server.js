const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path");
const socket = require("socket.io");
const mongoose = require("mongoose");

const testimonialsRoutes = require("./routes/testimonials.routes");
const seatsRoutes = require("./routes/seats.routes");
const concertsRoutes = require("./routes/concerts.routes");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/client/build")));

// connects our backend code with the database
mongoose.connect('mongodb://0.0.0.0:27017/NewWaveDB', { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));


const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});
const io = socket(server);


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api", testimonialsRoutes);
app.use("/api", seatsRoutes);
app.use("/api", concertsRoutes);

io.on("connection", (socket) => {
  console.log("New socket!");
});

// Serve static files from the React app


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found..." });
});