// Dependencies
const mongoose = require("mongoose")
const db = mongoose.connection
const shortId = require("shortid")

// Models
const Assignment = require("./models/assignment"),
    Course = require("./models/course")

// Helper functions
const dateParser = require("../parsers/date")
const shortid = require("shortid")

// Configurable options
const dbOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}

// Database class handler for Inii to call
class mongo {
    // Connect to database with passed in Host value
    // dbOpts shouldn't be changed unless you like deprecration warnings.
    connect(dbHost) {
        mongoose.connect(dbHost, dbOpts)
        db.on('error', console.error.bind(console, 'connection error: '))
        db.once('open', () => console.log('Database Initialized'))
    }

    // Add an Assignment
    async addAssignment(args) {
        let course = args[0],
            type = args[1],
            desc = args[2],
            due = args[3],
            reminder = args[4]

        // Change the input due date into a proper Date Object
        due = dateParser.formatDate(due)

        // Create the document for the Assignment
        let assignment = new Assignment({
            _id: shortid.generate(),
            course,
            type,
            desc,
            due,
            reminder
        })

        let savedAssignment = await assignment
            .save()
            .then(res => {
                return res.fullAssignment
            })
            .catch(e => { return `Error Saving Document: ${e}` })

        return savedAssignment
    }

    // Show Assignment(s)
    async showAssignment(args) {
        let findResult

        if (args == "*") {
            findResult = await Assignment
                .find({})
                .then(docs => {
                    let files
                    files = docs.map(doc => {
                        return doc.fullAssignment
                    })

                    return files
                })
                .catch(e => {
                    return "Error returning all docs"
                })
        } else {
            findResult = await Assignment
                .findById(args)
                .then(doc => { return doc.fullAssignment })
                .catch(e => { return `Error finding doc: ${e}`})
        }

        return findResult
    }


    // Add a course to the db
    async addCourse(args) {
        let course = args[0],
        type = args[1],
        desc = args[2],
        due = args[3],
        reminder = false

    // If "remind" is the fifth argument then reminder is set to true.
    if (args.length == 5) {
        if (args[4].toLowerCase() == "remind") {
            reminder = true
        }
    }

    // Substitute the course for an object ID if the course is already saved in our collection.
    await Course
        .findOne({ name: course }, function(err, res) {
            if (err) console.log("This Course doesn't exist")
            if (res == null || res == undefined) { return }
            course = res._id
        })

    // Change the input due date into a proper Date Object
    due = dateParser.formatDate(due)

    // Create the document for the Assignment
    let assignment = new Assignment({
        course,
        type,
        desc,
        due,
        reminder
    })

    let newAssignment = await assignment
        .save()
        .then(res => {
            console.log(res)
            return "Document saved successfully"
        })
        .catch(e => { return `Error Saving Document: ${e}` })

    console.log(newAssignment)
    }
}

module.exports = mongo