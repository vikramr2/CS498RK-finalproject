var schedule = require('../models/schedule.js');
var util = require('./util.js');
const Schedule = schedule;

module.exports = function handleSchedulesEndpoint(schedulesRoute) {
    schedulesRoute.get(function (req, res) {
        var queryObj = {where : {}, sort : {}, select : {}, skip : 0, limit : 100, count : false};
        util.setQueryParams(req.query, queryObj);

        if (queryObj.count) {
            Schedule.find(queryObj.where, queryObj.select).skip(queryObj.skip).limit(queryObj.limit).sort(queryObj.sort).count().exec(function (error, data) {
                util.getResponse(res, error, "OK", data);
            });
        } else {
            Schedule.find(queryObj.where, queryObj.select).skip(queryObj.skip).limit(queryObj.limit).sort(queryObj.sort).exec(function (error, data) {
                util.getResponse(res, error, "OK", data);
            });
        }
    });

    schedulesRoute.post(function (req, res) {
        const newCourseSchedule = new Schedule({
            title : req.body.title, 
            day : req.body.day,
            startHour : req.body.startHour,
            startMin : req.body.startMin,
            endHour : req.body.endHour,
            endMin : req.body.endMin,
            colorId : req.body.colorId
        });

        newCourseSchedule.save(function (err) {
            if (err) {
                util.serverError(res, err, "Server Error", [])
            } else {
                res.status(201).json({ 
                    message: 'New Course Schedule Created',
                    data : {
                        title : req.body.title, 
                        day : req.body.day,
                        startHour : req.body.startHour,
                        startMin : req.body.startMin,
                        endHour : req.body.endHour,
                        endMin : req.body.endMin,
                        colorId : req.body.colorId
                    } 
                });
            }
        });
    });
}