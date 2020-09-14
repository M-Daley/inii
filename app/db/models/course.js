// Dependencies
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Course Schema
const Course = new Schema({
    _id: String,
    name: String,
    days: [String], // Days of the week are recorded as 0 - 6: (Sunday - Saturday).
    start: String,
    end: String,
    zoom: String,
    reminders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reminder"
    },
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    }],
    completed: { type: Boolean, default: false }
})

// Plugins

// Export
module.exports = mongoose.model("Course", Course)