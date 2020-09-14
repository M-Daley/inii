// Depenedencies
const config = require("../discord/config.json"),
    prefix = config.prefix

let testAssignment = "!new Assign EDD-LS2 Paper Research paper on how to help children with disabilities 30/10 Remind"
let testCourse = "!new Course EDD-LS2 MW 1330:1530 https://zoomlink.com/hj/55518163"
let testShow = "!show assign Zbb8bC8gW"
let testShowAll = "!show assign *"

const regexPatterns = {
    command: RegExp(/(!\w+)\s(\w+)\s?/),
    /*
        Group 1 = Command (e.g., new, edit, del)
        Group 2 = Assign or Course
    */

    newAssign: RegExp(/([\w+-]+)\s(\w+)\s([\w+\s+]+)\s([\d+\/]+)\s?(\w+)?/),
    /*
        Group 1 = Course
        Group 2 = Type (Essay, Paper, etc) 
        Group 3 = Description
        Group 4 = Due Date
        Group 5 = Reminder. If no reminder is present at the end of the string their will be no Group 5
     */

    editAssign: RegExp(/(\w+)\s(\w+)\s(\w+)/),
    /*
        Group 1 = id
        Group 2 = Assignment field
        Group 3 = Change
    */

    newCourse: RegExp(/([\w+-]+)\s(\w+)\s([\d+:]+)\s(\w+\:\/\/\w+\.\w+\/\w+\/\w+)\s?/),
    /*
        Group 1 = name
        Group 2 = days
        Group 3 = timeframe
        Group 4 = zoom link
    */

    editCourse: RegExp(/(\w+)\s(\w+)\s(\w+\:\/\/\w+\.\w+\/\w+\/\w+|\w+)/),
    /*
        Group 1 = id
        Group 2 = Course field
        Group 3 = Change. Matches a zoom link or single word.
    */

    getId: RegExp(/((\w+|\*))\s?/)
    /*
        Group 1 = id
    */
}


// Take the passed in message String, determine the CRUD operation, determine what will be targeted and break down the remaining string with the according regular expression.
function commandBreakdown(s) {
    // Find the command & course of action.
    let matches = s.match(regexPatterns.command)
    let [_, _command, _target] = matches
    let command = _command.substring(prefix.length).toLowerCase()
    let target = _target.toLowerCase()


    // Remove command & action
    let ss = s.slice((command.length + target.length + 2), s.length).trim()

    switch(command) {
        case "new":
            if (target == "assign") {
                let matches = ss.match(regexPatterns.newAssign)
                let res = returnAssignmentArray(matches)
                return [command, target, res]
            } else if (target == "course") {
                let matches = ss.match(regexPatterns.newCourse)
                let res = returnCourseObject(matches)
                return [command, target, res]
            }
            break
        case "edit":
            if (action == "assign") {
                obj = ss.match(regexPatterns.editAssign)
            } else if (action == "course") {
                obj == ss.match(regexPatterns.editCourse)
            }
            break
        case "del":
            obj = ss.match(regexPatterns.getId)
            break
        case "show":
            res = ss.match(regexPatterns.getId)
            console.log(res)
            return [command, target, res[1]]
            break
        default:
            return Error(`Command not found`)
    }
}

// Constructs an object for creating new assignments using regex matches.
function returnAssignmentArray(stringMatches) {
    let course = stringMatches[1],
        type = stringMatches[2],
        desc = stringMatches[3],
        due = stringMatches[4],
        reminder = false

    if (stringMatches.length > 4) {
        if (stringMatches[5] == undefined) {}
        else if (stringMatches[5].toLowerCase() == "remind") {
            reminder = true
        }
    }

    return [
        course,
        type,
        desc,
        due,
        reminder
    ]
}

// Group 1 = name
// Group 2 = days
// Group 3 = timeframe
// Group 4 = zoom link

function returnCourseObject(stringMatches) {
    let name = stringMatches[1]
    let zoomlink = stringMatches[4]

    // Find input days of week
    let daysOfWeek = ["m", "t", "w", "r", "f"] // r = Thursday 
    let daysFromUser = stringMatches[2].toLowerCase()
    let matches = daysOfWeek.map(item => {
        if (daysFromUser.includes(item)) {
            return item
        }
    })
    
    let days = matches.filter(day => day != undefined)

    // seperate time frame into Start/End
    let [start, end] = stringMatches[3].split(":")

    return {
        name,
        days,
        start,
        end,
        zoomlink
    }
}

// commandBreakdown(testAssignment)
// commandBreakdown(testCourse)
// commandBreakdown(testShow)
commandBreakdown(testShowAll)

module.exports = {
    commandBreakdown
}