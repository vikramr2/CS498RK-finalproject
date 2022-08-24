var schedule = require('../models/schedule.js');
var user = require('../models/user.js');
var util = require('./util.js');
const Schedule = schedule;
const User = user;
const notFoundMessage = "A user with this uid does not exist";

module.exports = function handleSpecificUserEndpoint(specificUserRoute) {
    specificUserRoute.get(function(req, res) {
        const userID = req.params.uid;
        
        User.find({uid : userID}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                util.getResponse(res, error, "OK", data[0]);
            }
        });
    });

    specificUserRoute.put(function(req, res) {
        const userID = req.params.uid;
        var newSchedule = req.body.savedSchedule;
        if (newSchedule === undefined) {
            newSchedule = [];
        }

        User.find({uid : userID}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                // Make sure the all the courses exist in the Schedules db
                Schedule.find({title : {$in : newSchedule}}, function(error1, courses) {
                    const colorIds = new Set()
                    for (var i = 0; i < courses.length; i++) {
                        colorIds.add(courses[i].colorId)
                    }

                    if (error1) {
                        util.serverError(res, error1, "Server Error", []);
                    } else if (colorIds.size < newSchedule.length) {
                        util.badRequest(res, "One or more of the classes entered is not available", []);
                    } else {
                        // Update the user's saved schedule of courses
                        User.findOneAndUpdate({uid : userID}, {savedSchedule: newSchedule}, function(error2, user) {
                            if (error2) {
                                util.serverError(res, error2, "Server Error", []);
                            } else {
                                res.status(200).json({   
                                    message: "Successfully Updated User Course Schedule", 
                                    data : {
                                        uid: userID, 
                                        savedSchedule: newSchedule
                                    } 
                                });
                            }
                        });
                    } 
                }); 
            }
        });
    });

    specificUserRoute.delete(function(req, res) {
        const userID = req.params.uid;
        
        User.find({uid : userID}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                User.deleteOne({uid : userID}, function(error1) {
                    util.deleteResponse(res, error1, "Successfully Deleted User", []);
                });
            }
        });
    });
}