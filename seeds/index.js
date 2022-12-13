const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect(
  "mongodb+srv://test:1234@cluster0.kt07ram.mongodb.net/?retryWrites=true&w=majority"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 20) + 10;
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "http://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quae dolores nihil accusamus ut similique veniam delectus autem quia nisi quisquam fugiat accusantium dicta iusto dignissimos, consectetur tempore minima voluptates.",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  console.log("Database Closed");
  mongoose.connection.close();
});
