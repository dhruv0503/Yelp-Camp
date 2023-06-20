const mongoose = require('mongoose');
const cities = require('./seeds')
const campground = require('../Models/campground');
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("Database Connected");
})


const val = array => array[Math.floor(Math.random()*array.length)];

const seedDb = async () =>{
    await campground.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random = Math.floor(Math.random()* 1000);
        const price = Math.floor(Math.random() * 70) + 20;
        const camp = new campground({
            author : '64450d480aad473d9553879f',
            location : `${cities[random].city}, ${cities[random].state}`,
            title : `${val(descriptors)} ${val(places)}`,
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus saepe esse nostrum corrupti necessitatibus culpa, nulla possimus incidunt porro? Laudantium autem sint minima quidem similique qui quas ab facilis labore?',
            price : price,
            geometry: {
                type: "Point",
                coordinates: [cities[random].longitude, cities[random].latitude]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/diciztr9v/image/upload/v1685791450/YelpCamp/immgk7ucw7t8qkrgcv2u.jpg',
                    filename: 'YelpCamp/immgk7ucw7t8qkrgcv2u'
                }
              ]
        })
        await camp.save();
    }
}

seedDb()