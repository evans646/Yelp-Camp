const mongoose = require('mongoose');
const Review = require('./reviews')
const Schema = mongoose.Schema;

//campground images schema
const ImageSchema = new Schema({
    url: String,
    filename: String
});

//virtual images property to give each image a thumb width
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');//after upload
});
const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'] // 'location.type' must be 'Point'
        //   required: true
        },
        coordinates: {
          type: [Number],
        //   required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
//When we delete a campground we need to find it's associated reviews and delete them also || this is a middleware to delete all associated reviews 
CampgroundSchema.post('findOneAndDelete', async function (doc) {//doc is what we are trying to delete (campground), reviews is nested under doc
    if (doc) {
        await Review.deleteMany({
            _id: {//so find the reviews inside the docs 
                $in: doc.reviews
            }
        });
    };console.log("DELETED REVIEWS")//whenever a campground is deleted
});
module.exports = mongoose.model('Campground', CampgroundSchema);