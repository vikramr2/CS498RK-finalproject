export default function checkConflict(addedClass, userClasses, allSchedules) {
  var currClassesSchedule = filterClasses(userClasses, allSchedules);
  var newClassesSchedule = filterClasses([addedClass], allSchedules);
  console.log(newClassesSchedule)
  for (let i = 0; i < currClassesSchedule.length; i++) {
    for (let j = 0; j < newClassesSchedule.length; j++) {
      if (!check(currClassesSchedule[i], newClassesSchedule[j])) {
        var result = false;
        console.log(currClassesSchedule[i].title)
        console.log(newClassesSchedule[j].title)
        var oldClass = currClassesSchedule[i].title
        var newClass = newClassesSchedule[j].title
        return { 
          result, 
          oldClass,
          newClass
        };
      }
    }
  }
  result = true;
  oldClass = ''
  newClass = ''
  return { 
    result, 
    oldClass,
    newClass
  };
}

function filterClasses(userClasses, allSchedules) {
  var currSchedules = allSchedules.filter(schedule => userClasses.includes(schedule.title))
  return currSchedules;
}

function check(oldClass, newClass) {
  var oldStartValue = parseInt(oldClass.startHour) * 100 + parseInt(oldClass.startMin)
  var oldEndValue = parseInt(oldClass.endHour) * 100 + parseInt(oldClass.endMin)
  var newStartValue = parseInt(newClass.startHour) * 100 + parseInt(newClass.startMin)
  var newEndValue = parseInt(newClass.endHour) * 100 + parseInt(newClass.endMin)
  if (oldClass.day !== newClass.day || oldStartValue >= newEndValue || oldEndValue <= newStartValue) {
    return true;
  }
  return false;
}