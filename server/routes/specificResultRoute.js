var results = require('../models/results.js');
var util = require('./util.js');
const Result = results;
const notFoundMessage = "This course does not exist in the results";

module.exports = function handleSpecificResultEndpoint(specificResultRoute) {
    specificResultRoute.get(function(req, res) {
        const [department, courseNumber] = util.processCourseString(req.params.course);

        Result.find({department : department, courseNumber : courseNumber}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                util.getResponse(res, error, "OK", data[0]);
            }
        });
    });

    specificResultRoute.put(function(req, res) {
        const [department, courseNumber] = util.processCourseString(req.params.course);
        
        Result.find({department : department, courseNumber : courseNumber}, function(error, data) {
            console.log(data);
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                var hours = req.body.creditHours;
                if (hours === undefined) {
                    hours = data[0].creditHours;
                }
                var gpa = req.body.avgGPA;
                if (gpa === undefined) {
                    gpa = data[0].avgGPA;
                }
                var courseDifficulty = util.computeDifficulty(hours, gpa);

                var tags = req.body.courseTags
                if (tags === undefined) {
                    tags = data[0].courseTags;
                }
                
                Result.findOneAndUpdate({department : department, courseNumber : courseNumber}, {creditHours : hours, avgGPA : gpa, difficulty : courseDifficulty, courseTags : tags}, function(error1, result) {
                    if (error1) {
                        util.serverError(res, error1, "Server Error", []);
                    } else {
                        res.status(200).json({   
                            message: "Successfully Updated Course Result", 
                            data : {
                                department : department, 
                                courseNumber : courseNumber, 
                                courseName : data[0].courseName,
                                creditHours : hours,
                                avgGPA : gpa,
                                difficulty : courseDifficulty,
                                courseTags : tags
                            } 
                        });
                    }
                });
            }
        });
    });

    specificResultRoute.delete(function(req, res) {
        const [department, courseNumber] = util.processCourseString(req.params.course);

        Result.find({department : department, courseNumber : courseNumber}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                Result.deleteOne({department : department, courseNumber : courseNumber}, function(error1) {
                    util.deleteResponse(res, error1, "Successfully Deleted Course Result", []);
                });
            }
        });
    });
}