// Dependencies
const mongoose = require("mongoose"),
    Schema = mongoose.Schema
const shortid = require("shortid")

///////////////////////
// Assignment Schema //
///////////////////////
const Assignment = new Schema({
    _id: String,
    course: String,
    type: String,
    desc: String,
    due: Date,
    complete: {
        type: Boolean, default: false
    },
    reminder: Boolean
}, { _id: false })


/////////////////////////
// Assignment Virtuals //
/////////////////////////

// Returns the assignment properly formatted
Assignment.virtual("fullAssignment").get(function() {
    let reminder
    this.reminder ? reminder = ":white_check_mark:" : reminder = ":x:"

    return `${reminder} ${this._id} - ${this.course} - ${this.type} - ${this.desc} - Days Remaining: ${getRemainingDays(this.due)}`
})

// Returns the amount of days remaining before the assignment is due
function getRemainingDays(due) {
    let seconds = 1000,
        day = 86400
    let d = new Date()
    let today = d.getTime()
    let dueDate = due.getTime()

    let difference = dueDate - today
    let daysRemaining = ((difference / seconds) / day)

    return Math.floor(daysRemaining)
}


/////////////
// Plugins //
/////////////


////////////
// Export //
////////////

module.exports = mongoose.model("Assignment", Assignment)