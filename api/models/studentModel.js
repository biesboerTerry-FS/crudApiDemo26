const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: String, 
        required: true
    },
    created_at: {
        type: Date, 
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);