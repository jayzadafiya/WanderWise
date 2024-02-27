const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tore must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tore must have a price'],
    },
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;