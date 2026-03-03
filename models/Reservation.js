const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    coworking: { 
        type: mongoose.Schema.ObjectId,
        ref: 'Coworking', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});


module.exports = mongoose.model('Reservation', ReservationSchema);
