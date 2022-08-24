var schedule = require('../models/schedule.js');
var util = require('./util.js');
const Schedule = schedule;
const notFoundMessage = "This course does not exist in the schedules";

module.exports = function handleSpecificScheduleEndpoint(specificScheduleRoute) {
    specificScheduleRoute.get(function(req, res) {
        const id = req.params.id;
        
        Schedule.find({_id : id}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                util.getResponse(res, error, "OK", data[0]);
            }
        });
    });

    specificScheduleRoute.put(function(req, res) {
        const id = req.params.id;

        Schedule.find({_id : id}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                var startHour = req.body.startHour;
                if (startHour === undefined) {
                    startHour = data[0].startHour;
                }
                var startMin = req.body.startMin;
                if (startMin === undefined) {
                    startMin = data[0].startMin;
                }
                var endHour = req.body.endHour;
                if (endHour === undefined) {
                    endHour = data[0].endHour;
                }
                var endMin = req.body.endMin;
                if (endMin === undefined) {
                    endMin = data[0].endMin;
                }
                const colorId = data[0].colorId;
                
                Schedule.updateMany({colorId : colorId}, {startHour : startHour, startMin : startMin, endHour : endHour, endMin : endMin}, function(error1, result) {
                    if (error1) {
                        util.serverError(res, error1, "Server Error", []);
                    } else {
                        res.status(200).json({   
                            message: "Successfully Updated Course Schedule", 
                            data : {
                                title : data[0].title, 
                                day : data[0].day,
                                startHour : startHour,
                                startMin : startMin,
                                endHour : endHour,
                                endMin : endMin,
                                colorId : colorId
                            } 
                        });
                    }
                });
            }
        });
    });

    specificScheduleRoute.delete(function(req, res) {
        const id = req.params.id;

        Schedule.find({_id : id}, function(error, data) {
            if (error) {
                util.serverError(res, error, "Server Error", []);
            } else if (data === undefined || data.length < 1) {
                util.notFound(res, notFoundMessage, data);
            } else {
                const colorId = data[0].colorId;
                
                Schedule.deleteMany({colorId : colorId}, function(error1) {
                    util.deleteResponse(res, error1, "Successfully Deleted Course Schedule", []);
                });
            }
        });
    });
}