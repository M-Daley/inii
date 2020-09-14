// Passed in date is formatted as dd/mm. This will convert that input into a date object.
function formatDate(s) {
    let date,
        thisYear,
        today = new Date()

    // Seperating the day and month "dd/mm" -> [dd, mm]
    let enteredDate = s.split("/")
    
    // Get the year for the entered date by checking if today is before or after the passed in date. 
    let thisMonth = today.getMonth() + 1
    let thisDay = today.getDate()
    thisYear = today.getFullYear()

    if (enteredDate[1] <= thisMonth) {
        thisYear += 1
    }

    date = new Date(thisYear, enteredDate[1], enteredDate[0])
    return date
}

module.exports = {
    formatDate
}