import moment from 'moment';

const currentDate = moment();
let date = currentDate.date();

const makeAppointment = (day, startHour, startMin, endHour, endMin) => {
  if (moment().isoWeekday() === 7) {
    const nextStartDate = moment().add(5, 'days')
    .isoWeekday(day)
    .set("hour", startHour)
    .set("minute", startMin)
    const nextEndDate = moment().add(5, 'days')
      .isoWeekday(day)
      .set("hour", endHour)
      .set("minute", endMin)
    return {
      startDate: nextStartDate.toDate(),
      endDate: nextEndDate.toDate(),
    };
  } else {
    const nextStartDate = moment()
    .isoWeekday(day)
    .set("hour", startHour)
    .set("minute", startMin)
    const nextEndDate = moment()
      .isoWeekday(day)
      .set("hour", endHour)
      .set("minute", endMin)
    return {
      startDate: nextStartDate.toDate(),
      endDate: nextEndDate.toDate(),
    };
  }
  
};

export default function mapSchedules(schedules) {

  return schedules.map(({ day, startHour, startMin, endHour, endMin,  ...restArgs }) => {

    const result = {
      ...makeAppointment(day, startHour, startMin, endHour, endMin),
      ...restArgs,
    };
    console.log(result)
    date += 1;
    if (date > 31) date = 1;
    return result;
  });
}

