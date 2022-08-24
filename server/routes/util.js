function setQueryParams(query, queryObj) {
    if (Object.keys(query).length !== 0) {
        if (query.where !== undefined) {
            queryObj.where = JSON.parse(query.where);
        }
        if (query.sort !== undefined) {
            queryObj.sort = JSON.parse(query.sort);
        }
        if (query.select !== undefined) {
            queryObj.select = JSON.parse(query.select);
        }
        if (query.skip !== undefined) {
            queryObj.skip = JSON.parse(query.skip);
        }
        if (query.limit !== undefined) {
            queryObj.limit = JSON.parse(query.limit);
        }
        if (query.count !== undefined) {
            queryObj.count = JSON.parse(query.count);
        }
    }
}

function serverError(res, error, message_, data_) {
    console.log(error);
    res.status(500).json({
        message: message_,
        data : data_
    });
}

function notFound(res, message_, data_) {
    res.status(404).json({
        message: message_,
        data : data_
    });
}

function badRequest(res, message_, data_) {
    res.status(400).json({
        message : message_,
        data : data_
    });
}

function deleteResponse(res, error, message_, data_) {
    if (error) {
        serverError(res, error, "Server Error", []);
    } else {
        res.status(200).json({
            message: message_,
            data : data_
        });
    }
}

function getResponse(res, error, message_, data_,) {
    if (error) {
        serverError(res, error, "Server Error", []);
    } else {
        res.status(200).json({
            message: message_,
            data : data_
        });
    }
}

// processCourseString('cs100') will return ['CS', '100']
function processCourseString(courseString) {
    courseString = courseString.toUpperCase();
    return [courseString.match(/[a-zA-Z]+/g)[0], courseString.match(/\d+/g)[0]];
}

// processCourseList(['CS100', 'ECE200']) will return [ ['CS', 'ECE'], ['100', '200'] ]
function processCourseList(courses) {
    var departments = [];
    var courseNumbers = [];
    for (var i = 0; i < courses.length; i++) {
        const [department, courseNumber] = processCourseString(courses[i]);
        departments.push(department);
        courseNumbers.push(courseNumber);
    }
    return [departments, courseNumbers];
}

// May change later to incorporate creditHours
function computeDifficulty(creditHours, avgGPA) {
    if (avgGPA >= 3.67) {
        return "Easy";
    } else if (avgGPA >= 3.00) {
        return "Medium";
    } else {
        return "Hard";
    }
}

module.exports = {
    serverError,
    notFound,
    setQueryParams,
    badRequest,
    deleteResponse,
    getResponse,
    processCourseString,
    processCourseList,
    computeDifficulty
}
