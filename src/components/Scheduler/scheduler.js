import { TableCell, Typography} from '@mui/material';
import { ViewState, EditingState, IntegratedEditing } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";
// import moment from 'moment';

const TimeTableCell = (props) => {
  return (<WeekView.TimeTableCell  {...props} />);
};

const dayScaleCell = ({ startDate, endDate, today }) => (
  <TableCell align = "center">
    <Typography>
      {Intl.DateTimeFormat("en-US", { weekday: "long" }).format(startDate)}
    </Typography>
  </TableCell>
);

// const formatDateAppointmentPlugin = (date, options) => {
//   // const momentDate = moment(date);
//   // return momentDate.format('dddd');
//   console.log(date)
//   console.log(Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date))
//   return Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)
// };

// const appointmentContentProps = (props) => {
//   return (<Appointments.AppointmentContent formatDate = {formatDateAppointmentPlugin} {...props} />);
// };

// const appointmentToolTipContentProps = (props) => {
//   return (<AppointmentTooltip.Content	formatDate = {formatDateAppointmentPlugin} {...props} />);
// };


const CustomAppointment = ({ style, ...restProps }) => {
  if (restProps.data.colorId % 15 === 0)
    return (
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#53A548" }}
      />
    );
  if (restProps.data.colorId % 15 === 1)
    return (
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#DA7635" }}
      />
    );
    
  if (restProps.data.colorId % 15 === 2)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#82735C" }}
      />
    );
  if (restProps.data.colorId % 15 === 3)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#4B3B40" }}
      />
    );
  if (restProps.data.colorId % 15 === 4)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#63B0CD" }}
      />
    );
  if (restProps.data.colorId % 15 === 5)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#8A817C" }}
      />
    );
  if (restProps.data.colorId % 15 === 6)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#FF37A6" }}
      />
    );
  if (restProps.data.colorId % 15 === 7)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#795663" }}
      />
    );
  if (restProps.data.colorId % 15 === 8)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#E07A5F" }}
      />
    );
  if (restProps.data.colorId % 15 === 9)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#3D405B" }}
      />
    );
  if (restProps.data.colorId % 15 === 10)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#4E0110" }}
      />
    );
  
  if (restProps.data.colorId % 15 === 11)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#881600" }}
      />
    );
  if (restProps.data.colorId % 15 === 12)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#C16200" }}
      />
    );
  if (restProps.data.colorId % 15 === 13)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#60A561" }}
      />
    );
  if (restProps.data.colorId % 15 === 14)
    return (      
      <Appointments.Appointment
        {...restProps}
        style={{ ...style, backgroundColor: "#E34A6F" }}
      />
    );
  return (
    <Appointments.Appointment
      {...restProps}
      style={style}
    />
  );
};


export default function Schedulers(props) {
  
  const commitChanges = ({added, changed, deleted} ) => {
    props.onDelete(deleted)
  }

  console.log(props.schedules)

  return(
      <Scheduler data={props.schedules} >
        <ViewState />
        <EditingState onCommitChanges = {commitChanges}/>
        <WeekView
          excludedDays={[0, 6]}
          startDayHour={8}
          endDayHour={19}
          timeTableCellComponent={TimeTableCell}
          dayScaleCellComponent={dayScaleCell}
          cellDuration={60}
        />
        <IntegratedEditing />
        <Appointments 
        appointmentComponent={CustomAppointment}
        // appointmentContentComponent = {appointmentContentProps}
        />
        <AppointmentTooltip
            showDeleteButton
            showCloseButton
            // contentComponent = {appointmentToolTipContentProps}
        />
      </Scheduler>
  )
}