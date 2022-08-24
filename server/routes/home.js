var secrets = require('../config/secrets');

module.exports = function (router) {

    var homeRoute = router.route('/');

    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    var usersRoute = router.route('/users');
    const usersEndpoint = require('./usersRoute.js');
    usersEndpoint(usersRoute);

    var specificUserRoute = router.route('/users/:uid');
    const specificUserEndpoint = require('./specificUserRoute.js');
    specificUserEndpoint(specificUserRoute);

    var resultsRoute = router.route('/results');
    const resultsEndpoint = require('./resultsRoute.js');
    resultsEndpoint(resultsRoute);

    var specificResultRoute = router.route('/results/:course');
    const specificResultEndpoint = require('./specificResultRoute.js');
    specificResultEndpoint(specificResultRoute);

    var schedulesRoute = router.route('/schedules');
    const schedulesEndpoint = require('./schedulesRoute.js');
    schedulesEndpoint(schedulesRoute);

    var specificScheduleRoute = router.route('/schedules/:id');
    const specificScheduleEndpoint = require('./specificScheduleRoute.js');
    specificScheduleEndpoint(specificScheduleRoute);

    return router;
}
