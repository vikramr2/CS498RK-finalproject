import * as React from 'react';
import { useAuthState } from '../auth/firebase'
import { getAuth, signOut } from '@firebase/auth'
import { Button, Tabs, Tab, Box, Grid, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import mapSchedules from "./appointments";
import checkConflict from "./checkConflict";
import ScheduleGenerator from "./schedulegenerator";
import Recommender from './recommender';
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Schedule() {
  
  const uid = useAuthState().user.uid;
  const userAPICall = "https://cs498rkuiucfp.herokuapp.com/api/users/"
  const resultsAPICall = "https://cs498rkuiucfp.herokuapp.com/api/results/"
  const schedulesAPICall = "https://cs498rkuiucfp.herokuapp.com/api/schedules/"
  const [value, setValue] = React.useState(0);
  const [userClasses, setUserClasses] = React.useState([]);
  const [allClasses, setAllClasses] = React.useState([]);
  const [allResults, setAllResults] = React.useState([]);
  const [allSchedules, setAllSchedules] = React.useState([]);
  const [userSchedules, setUserSchedules] = React.useState([]);
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [actor, setActor] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);
  const [oldClassAdd, setOldClassAdd] = React.useState('');
  const [oldClassAddGenerator, setOldClassAddGenerator] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [maxHours, setMaxHours] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');
  const [interests, setInterests] = React.useState('');
  const [classRecommendation, setClassRecommendation] = React.useState([]);
  const [allDepartment, setAllDepartment] = React.useState([]);
  const [openAddError, setOpenAddError] = React.useState(false);
  const [openAddSuccess, setOpenAddSuccess] = React.useState(false);
  const [openRemoveSuccess, setOpenRemoveSuccess] = React.useState(false);

  React.useEffect(()=> {
    retrieveAllResultsInfo();
    retrieveAllSchedulesInfo();
    retrieveUserClasses();
    // eslint-disable-next-line
  },[])

  React.useEffect(()=> {
    getListOfClasses(allSchedules)
    // eslint-disable-next-line
  },[allSchedules])


  React.useEffect(()=> {
    console.log(userClasses)
    console.log(allSchedules)
    filterClasses(userClasses, allSchedules);
    // eslint-disable-next-line
  },[allSchedules, userClasses])

  React.useEffect(()=> {
    filterClasses(userClasses, allSchedules);
    // eslint-disable-next-line
  },[userClasses])

  React.useEffect(()=> {
    setActor(!actor);
    // eslint-disable-next-line
  },[userSchedules])

  async function retrieveUserClasses() {
    await axios.get(userAPICall+uid, {}).then(response=> {
      console.log(response.data.data.savedSchedule)
      setUserClasses(response.data.data.savedSchedule);
    })
    .catch(error => {
      if(error.response.status === 404) {
        createNewUser()
      } else {
        console.log(error)
      }
    })
  }

  async function retrieveAllResultsInfo() {
    await axios.get(resultsAPICall, {}).then(response=> {
      setAllResults(response.data.data);
      var allDepartments = response.data.data.map(item => item.department)
      allDepartments = [...new Set(allDepartments)];
      setAllDepartment(allDepartments);
    })
    .catch(error => {
      console.log(error);
    })
  }

  async function retrieveAllSchedulesInfo() {

    await axios.get(schedulesAPICall, {}).then(response=> {
      setAllSchedules(response.data.data);
    })
    .catch(error => {
      console.log(error);
    })
  }

  async function createNewUser() {
    await axios.post(userAPICall, {
      uid: uid
    }).then(
      setUserClasses([])
    )
    .catch(error => {
      console.log(error);
    })
  }

  function filterClasses(currUserClasses, schedules) {
    console.log(currUserClasses)
    if (schedules) {
      var currSchedules = schedules.filter(schedule => currUserClasses.includes(schedule.title))
      currSchedules = currSchedules.map(function(el) {
        el.id = el._id
        return el
      })
      setUserSchedules(mapSchedules(currSchedules));
    } else {
      setUserSchedules([])
    }
  }

  function getListOfClasses(schedules) {
    var classes = schedules.map(element =>element.title);
    classes = [...new Set(classes)];
    classes = classes.map(element =>{ return {label: element}});
    setAllClasses(classes);
  }
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function onLogOut(e) {
    const auth = getAuth();
    signOut(auth).then( ()=> {
      console.log("Successfully Logged Out")
    }).catch((error) => {
      console.log(error);
    });
  }

  async function editSavedSchedule(newSchedule) {
    await axios.put(userAPICall+uid, {
      savedSchedule: newSchedule
    }).then(response=> {
      retrieveUserClasses()
    })
    .catch(error => {
      console.log(error);
    })
  }

  function onSearch(e) {
    console.log(userClasses)
    var currUserClass = userClasses;
    if (searchInputValue.label !== "" && !currUserClass.includes(searchInputValue.label)) {
      var check = checkConflict(searchInputValue.label, userClasses, allSchedules);
      if (check.result) {
        currUserClass.push(searchInputValue.label);
        editSavedSchedule(currUserClass);
      } else {
        setOldClassAdd(check.oldClass);
        handleOpen();
      }
    }
  }

  const handleOpen = () => {
    setDialog(true);
  };

  const handleClose = () => {
    setDialog(false);
  };

  function onDelete(e) {
    var currUserClass = userClasses;
    var currUserSchedule = userSchedules;
    if (e !== "") {
      var currClass;
      currClass = currUserSchedule.filter(item =>item.id === e)[0].title
      if (currUserClass.includes(currClass)) {
        currUserClass = currUserClass.filter(item => item !== currClass)
        currUserSchedule = currUserSchedule.filter(item => item.title !== e)
        setUserSchedules(currUserSchedule);
        editSavedSchedule(currUserClass);
      }
    }
  }

  function onSubmitFilter() {
    var currAllResults = allResults;
    var currAllSchedules = allSchedules;
    var filterResults = currAllResults.filter(function(item) {
      if (interests !== "") {
        if (item.department === department && parseInt(maxHours) >= parseInt(item.creditHours) && item.difficulty === difficulty && item.courseTags.includes(interests)) {
              return true;
        } else {
          return false
        }
      } else {
        if (item.department === department && parseInt(maxHours) >= parseInt(item.creditHours) && item.difficulty === difficulty) {
          return true;
        } else {
          return false
        }
      }
    });
    if (filterResults.length !== 0) {
      setClassRecommendation(getRecommendationsSchedule(filterResults, currAllSchedules));
    } else {
      setClassRecommendation([]);
    }
    
  }

  function getRecommendationsSchedule(filterResults, currAllSchedules) {
    var tempResults = filterResults.map(function(item) {
      var tempAllSchedules = currAllSchedules;
      var courseTitle = item.department + " " + item.courseNumber;
      console.log(courseTitle)
      var filteredCourse = tempAllSchedules.filter(item => item.title === courseTitle)
      var stringDays = ""
      var stringTiming = ""

      for(var classValue of filteredCourse) {
        if (classValue.day === 1) {
          stringDays = stringDays + "M";
        } else if (classValue.day === 2) {
          stringDays = stringDays + "T";
        } else if (classValue.day === 3) {
          stringDays = stringDays + "W";
        } else if (classValue.day === 4) {
          stringDays = stringDays + "R";
        } else {
          stringDays = stringDays + "F";
        }
      }
      console.log(filteredCourse)
      var startHour = parseInt(filteredCourse[0].startHour) % 12;
      if (startHour === 0) {
        startHour = 12;
      }

      var ampmStart = Math.floor(parseInt(filteredCourse[0].startHour) / 12)
      if (ampmStart === 0) {
        ampmStart = "AM";
      } else {
        ampmStart = "PM";
      }

      var endHour = parseInt(filteredCourse[0].endHour) % 12;
      if (endHour === 0) {
        endHour = 12;
      }

      var ampmEnd = Math.floor(parseInt(filteredCourse[0].endHour) / 12)
      if (ampmEnd === 0) {
        ampmEnd = "AM";
      } else {
        ampmEnd = "PM";
      }

      var startMin= parseInt(filteredCourse[0].startMin);
      if(startMin < 10) {
        startMin = "0" + filteredCourse[0].startMin.toString();
      } else {
        startMin = filteredCourse[0].startMin.toString();
      }

      var endMin= parseInt(filteredCourse[0].endMin);
      if(endMin < 10) {
        endMin = "0" + filteredCourse[0].endMin.toString();
      } else {
        endMin = filteredCourse[0].endMin.toString();
      }

      stringTiming = startHour.toString() + ":" + startMin + ampmStart + " - " + endHour.toString() + ":" + endMin + ampmEnd;
      return {
        department: item.department,
        courseNumber: item.courseNumber,
        courseName: item.courseName,
        avgGPA: item.avgGPA,
        days: stringDays,
        timing: stringTiming
      }

    }
    );
    return tempResults;
  }

  function addRecommendedClass(classAdded) {
    console.log(classAdded)
    var currUserClass = userClasses;
    if (!currUserClass.includes(classAdded)) {
      var check = checkConflict(classAdded, userClasses, allSchedules);
      if (check.result) {
        currUserClass.push(classAdded);
        editSavedSchedule(currUserClass);
        handleOpenSuccessSnackBarGenerator();
      } else {
        setOldClassAddGenerator(check.oldClass);
        handleOpenSnackBarGenerator();
      }
    }
  }

  function removeRecommendedClass(classRemoved) {
    console.log(classRemoved)
    var currUserClass = userClasses;
    var currUserSchedule = userSchedules;
    if (currUserClass.includes(classRemoved)) {
      currUserClass = currUserClass.filter(item => item !== classRemoved)
      currUserSchedule = currUserSchedule.filter(item => item.title !== classRemoved)
      setUserSchedules(currUserSchedule);
      editSavedSchedule(currUserClass);
      handleRemoveOpenSuccessSnackBarGenerator()
    }
  }

  function onChangeInterests(e) {
    setInterests(e.target.value);
  }

  function onChangeMaxHour(e) {
    setMaxHours(e.target.value);
  }

  function handleOpenSuccessSnackBarGenerator() {
    setOpenAddSuccess(true);
  }

  function closeSuccessSnackBarGenerator() {
    setOpenAddSuccess(false);
  }

  function handleRemoveOpenSuccessSnackBarGenerator() {
    setOpenRemoveSuccess(true);
  }

  function closeRemoveSuccessSnackBarGenerator() {
    setOpenRemoveSuccess(false);
  }
  
  function handleOpenSnackBarGenerator() {
    setOpenAddError(true);
  }

  function closeSnackBarGenerator() {
    setOpenAddError(false);
  }

  return(
    <Box>
      <Grid container spacing={2} justifyContent="center" alignItems="center" direction="row">
        <Grid item xs={12}>
          <Box display="flex" >
            <Box m="auto">
              <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
                <Tab icon={<CalendarTodayIcon />} label="SCHEDULE GENERATOR" iconPosition="start" {...a11yProps(0)} />
                <Tab icon={<SearchIcon />} label="CLASS RECOMMENDATION" iconPosition="start" {...a11yProps(1)} />
              </Tabs>
            </Box>
          </Box>
        </Grid>
        <Box sx={{position: 'absolute', right: '40px', top: '20px'}}>
          <Button variant="contained" color = "warning" onClick = {onLogOut} size="medium" startIcon={<LogoutIcon />}>Log Out</Button>
        </Box>
        <TabPanel value={value} index={0}>
          <ScheduleGenerator 
            searchInputValue = {searchInputValue}
            setSearchInputValue = {setSearchInputValue}
            allClasses = {allClasses}
            onSearch = {onSearch}
            userSchedules = {userSchedules}
            onDelete = {onDelete}
            actor = {actor}
            dialog = {dialog}
            handleClose = {handleClose}
            oldClassAdd = {oldClassAdd}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
            <Recommender
              classRecommendation = {classRecommendation}
              department = {department}
              setDepartment = {setDepartment}
              difficulty = {difficulty}
              setDifficulty= {setDifficulty}
              onSubmitFilter = {onSubmitFilter}
              allDepartment = {allDepartment}
              userClasses = {userClasses}
              addRecommendedClass = {addRecommendedClass}
              oldClassAddGenerator = {oldClassAddGenerator}
              openAddError = {openAddError}
              closeSnackBarGenerator = {closeSnackBarGenerator}
              closeSuccessSnackBarGenerator = {closeSuccessSnackBarGenerator}
              openAddSuccess = {openAddSuccess}
              onChangeInterests = {onChangeInterests}
              onChangeMaxHour = {onChangeMaxHour}
              interests = {interests}
              maxHours = {maxHours}
              removeRecommendedClass = {removeRecommendedClass}
              closeRemoveSuccessSnackBarGenerator = {closeRemoveSuccessSnackBarGenerator}
              openRemoveSuccess = {openRemoveSuccess}

            />
        </TabPanel>

     </Grid>
    </Box>
  )
}