const mongoose = require('mongoose');

const CoworkingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [100, 'Name can not be more than 100 characters']
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        telephone: {
            type: String,
            required: [true, 'Please add a telephone number']
        },
        openTime: {
            type: String,
            required: [true, 'Please add an open time (e.g., 08:00)']
        },
        closeTime: {
            type: String,
            required: [true, 'Please add a close time (e.g., 20:00)']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

CoworkingSchema.virtual('reservations', {
    ref: 'Reservation', 
    localField: '_id',       
    foreignField: 'coworking', 
    justOne: false
});

module.exports = mongoose.model('Coworking', CoworkingSchema);