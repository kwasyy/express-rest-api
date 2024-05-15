const express = require("express");
const db = require("../db");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.route("/concerts").get((req, res) => {
  res.json(db.concerts);
});
router.route("/concerts/:id").get((req, res) => {
  const concertId = parseInt(req.params.id);
  const concert = db.concerts.find((concert) => concert.id === concertId);
  if (concert) {
    res.json(concert);
  } else {
    res.status(404).json({ message: "Concert not found" });
  }
});
router.route("/concerts").post((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  if (!performer || !genre || !price || !day || !image) {
    res.status(400).json({ message: "All fields are required" });
  } else {
    const newConcert = {
      id: uuidv4(),
      performer,
      genre,
      price,
      day,
      image,
    };
    db.concerts.push(newConcert);
    res.json({ message: "OK" });
  }
});
router.route("/concerts/:id").delete((req, res) => {
  const index = db.concerts.findIndex(
    (concert) => concert.id === parseInt(req.params.id)
  );
  if (index === -1) {
    res.status(404).json({ message: "Concert not found" });
  } else {
    db.concerts.splice(index, 1);
    res.json({ message: "OK" });
  }
});
router.route("/concerts/:id").put((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const concertId = parseInt(req.params.id);
  const concert = db.concerts.find((concert) => concert.id === concertId);
  if (!concert) {
    res.status(404).json({ message: "Concert not found" });
  } else {
    concert.performer = performer;
    concert.genre = genre;
    concert.price = price;
    concert.day = day;
    concert.image = image;
    res.json({ message: "OK" });
  }
});
module.exports = router;