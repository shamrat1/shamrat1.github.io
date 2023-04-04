$(document).ready(function () {

    // var joiningDate = "May, 1, 2019";

    // var careerStarted = new Date(joiningDate);
    // var today = new Date();

    // var currentYear = new Date().getFullYear();
    // var yearOfExp = parseInt(DateDiff.inMonths(careerStarted, today) / 12);
    // var monthOfExp = parseInt((DateDiff.inMonths(careerStarted, today) + 1) % 12);
    // yearOfExp += monthOfExp/12;
    // monthOfExp = monthOfExp%12;
    // // console.log(currentYear);
    // // console.log(monthOfExp);
    // // console.log(yearOfExp);
    // var totalExperience = parseInt(yearOfExp) + "Y " + monthOfExp + "M ";
    // $("#currentYear").html(currentYear);
    // $("#totalExperience").html(totalExperience);

    // Define the start date
var startDate = new Date('May 1, 2019');

// Get the current date
var today = new Date();

// Calculate the difference in months
var diffMonths = (today.getFullYear() - startDate.getFullYear()) * 12;
diffMonths -= startDate.getMonth();
diffMonths += today.getMonth();

// Calculate the years and months
var years = Math.floor(diffMonths / 12);
var months = diffMonths % 12;
    $("#currentYear").html(new Date().getFullYear());
    $("#totalExperience").html(years + 'Y ' + months + 'M');
// Print the result
console.log(years + ' years and ' + months + ' months');

});


var DateDiff = {

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
}
