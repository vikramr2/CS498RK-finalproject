var schedule = require('../models/schedule.js');
var user = require('../models/user.js');
var util = require('./util.js');
const Schedule = schedule;
const User = user;

module.exports = function handleUsersEndpoint(usersRoute) {
    usersRoute.get(function (req, res) {
        var queryObj = {where : {}, sort : {}, select : {}, skip : 0, limit : 100, count : false};
        util.setQueryParams(req.query, queryObj);
        
        if (queryObj.count) {
            User.find(queryObj.where, queryObj.select).skip(queryObj.skip).limit(queryObj.limit).sort(queryObj.sort).count().exec(function (error, data) {
                util.getResponse(res, error, "OK", data);
            });
        } else {
            User.find(queryObj.where, queryObj.select).skip(queryObj.skip).limit(queryObj.limit).sort(queryObj.sort).exec(function (error, data) {
                util.getResponse(res, error, "OK", data);
            });  
        }
    });

    usersRoute.post(function (req, res) {
        var newSchedule = req.body.savedSchedule;
        if (newSchedule === undefined) {
            newSchedule = [];
        }

        const newUser = new User({ 
            uid: req.body.uid, 
            savedSchedule: newSchedule
        });

        // Check if a user with this uid already exists
        User.find({uid : req.body.uid}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", [])
            } else if (data.length > 0) {
                util.badRequest(res, "A user with this uid already exists", []);
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
                        // Save the new user
                        newUser.save(function (err) {
                            if (err) {
                                util.serverError(res, err, "Server Error", [])
                            } else {
                                res.status(201).json({ 
                                    message: 'New User Created',
                                    data : {
                                        uid: req.body.uid,  
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
}