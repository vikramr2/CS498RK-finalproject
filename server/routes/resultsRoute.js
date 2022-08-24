var results = require('../models/results.js');
var util = require('./util.js');
const Result = results;

module.exports = function handleResultsEndpoint(resultsRoute) {
    resultsRoute.get(function (req, res) {
        var queryObj = {where : {}, sort : {}, select : {}, skip : 0, limit : 1500, count : false};
        util.setQueryParams(req.query, queryObj);

        if (queryObj.count) {
            Result.find(queryObj.where, queryObj.select).skip(queryObj.skip).limit(queryObj.limit).sort(queryObj.sort).count().exec(function (error, data) {
                util.getResponse(res, error, "OK", data);
            });
        } else {
            Result.find(queryObj.where, queryObj.select).skip(queryObj.skip).limit(queryObj.limit).sort(queryObj.sort).exec(function (error, data) {
                util.getResponse(res, error, "OK", data);
            });
        }
    });

    resultsRoute.post(function (req, res) {
        const courseDifficulty = util.computeDifficulty(req.body.creditHours, req.body.avgGPA);

        var tags = req.body.courseTags
        if (tags === undefined) {
            tags = [];
        }

        const newCourseResult = new Result({
            department : req.body.department, 
            courseNumber : req.body.courseNumber, 
            courseName : req.body.courseName,
            creditHours : req.body.creditHours,
            avgGPA : req.body.avgGPA,
            difficulty : courseDifficulty,
            courseTags : tags
        });

        // Check if a course with this department and number already exists in the schedule (we assume there can only be one section per class)
        Result.find({department : req.body.department, courseNumber : req.body.courseNumber}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", [])
            } else if (data.length > 0) {
                util.badRequest(res, "This course already exists in Results", []);
            } else {
                newCourseResult.save(function (err) {
                    if (err) {
                        util.serverError(res, err, "Server Error", [])
                    } else {
                        res.status(201).json({ 
                            message: 'New Course Result Created',
                            data : {
                                department : req.body.department, 
                                courseNumber : req.body.courseNumber, 
                                courseName : req.body.courseName,
                                creditHours : req.body.creditHours,
                                avgGPA : req.body.avgGPA,
                                difficulty : courseDifficulty,
                                courseTags : tags
                            } 
                        });
                    }
                });
            }
        });        
    });
}