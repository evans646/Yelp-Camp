const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60942052a7d94f8d1c3f5fd9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/evans646/image/upload/v1620994505/YelpCamp/qf1xfur9lrwscxsioh8m.jpg',
                  filename: 'YelpCamp/qf1xfur9lrwscxsioh8m'
                },
                {
                  url: 'https://res.cloudinary.com/evans646/image/upload/v1620994576/YelpCamp/jcdxrast6goaodnhdilp.jpg',
                  filename: 'YelpCamp/jcdxrast6goaodnhdilp'
                }
              ]
        });
        await camp.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});