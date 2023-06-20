const mongoose = require('mongoose')
const Review = require('./review')
const {Schema} = mongoose;

const imageSchema = mongoose.Schema(
    {
        url : String,
        filename : String
    }
)

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
    
});

const opts = {toJSON : {virtuals:true}};

const campgroundSchema = mongoose.Schema({
    title : String,
    price : Number,
    description : String,
    image : [imageSchema],
    geometry : {
        type: {
            type : String,
            enum : ['Point']
        },
        coordinates : {
            type : [Number]
        }
    }, 
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    review : [{
        type : Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>`;
})

campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id : {
                $in: doc.review
            }
        })
    }
}) 

const Campground =  mongoose.model('Campground', campgroundSchema);
module.exports = Campground